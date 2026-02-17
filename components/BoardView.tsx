
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { BoardData, List, Task, User, TaskPriority } from '../types';
import { Plus, MoreHorizontal, User as UserIcon, Calendar, Trash2, Edit2, Search, Filter, X } from 'lucide-react';

interface BoardViewProps {
  boardId: string;
  userId: string;
  refreshTrigger: number;
}

const BoardView: React.FC<BoardViewProps> = ({ boardId, userId, refreshTrigger }) => {
  const [data, setData] = useState<BoardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [activeListId, setActiveListId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const bData = await api.getBoardDetails(boardId);
      const uData = await api.getUsers();
      setData(bData);
      setUsers(uData);
    };
    fetchData();
  }, [boardId, refreshTrigger]);

  const handleMoveTask = async (taskId: string, newListId: string) => {
    await api.moveTask(taskId, newListId, userId);
    // Local update for immediate feedback
    setData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, listId: newListId } : t)
      };
    });
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const priority = formData.get('priority') as TaskPriority;
    const assigneeId = formData.get('assigneeId') as string;

    const newTask = await api.createTask({
      boardId,
      listId: activeListId!,
      title,
      priority,
      assigneeId: assigneeId || undefined,
    }, userId);

    setData(prev => prev ? { ...prev, tasks: [...prev.tasks, newTask] } : null);
    setIsTaskModalOpen(false);
  };

  const filteredTasks = data?.tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  if (!data) return <div className="p-8">Loading board...</div>;

  return (
    <div className="flex flex-col h-full">
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h2 className="text-2xl font-bold text-gray-900">{data.board.title}</h2>
          <div className="flex -space-x-2">
            {users.map((u, i) => (
              <img key={u.id} src={u.avatar} title={u.name} className="w-8 h-8 rounded-full border-2 border-white" />
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search in board..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-gray-200 transition-all outline-none"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-x-auto p-8 custom-scrollbar">
        <div className="flex space-x-6 h-full min-h-[500px]">
          {data.lists.map(list => (
            <div key={list.id} className="flex flex-col w-80 shrink-0 bg-gray-100/50 rounded-2xl border border-gray-200/50">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-gray-700 uppercase tracking-wider text-xs">{list.title}</h3>
                  <span className="bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {filteredTasks.filter(t => t.listId === list.id).length}
                  </span>
                </div>
                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div 
                className="flex-1 px-4 pb-4 overflow-y-auto custom-scrollbar space-y-3"
                onDragOver={e => e.preventDefault()}
                onDrop={e => {
                  const taskId = e.dataTransfer.getData('taskId');
                  handleMoveTask(taskId, list.id);
                }}
              >
                {filteredTasks.filter(t => t.listId === list.id).map(task => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={e => e.dataTransfer.setData('taskId', task.id)}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-grab active:cursor-grabbing group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                        task.priority === 'high' ? 'bg-red-50 text-red-600' : 
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {task.priority}
                      </span>
                      <button 
                        onClick={() => api.deleteTask(task.id, userId)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-600 rounded text-gray-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <h4 className="font-semibold text-gray-900 leading-snug mb-3">{task.title}</h4>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex items-center text-gray-400 text-[10px] space-x-2">
                        <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(task.createdAt).toLocaleDateString()}</span>
                      </div>
                      {task.assigneeId && (
                        <img 
                          src={users.find(u => u.id === task.assigneeId)?.avatar} 
                          className="w-6 h-6 rounded-full ring-2 ring-white"
                          title={users.find(u => u.id === task.assigneeId)?.name}
                        />
                      )}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => {
                    setActiveListId(list.id);
                    setIsTaskModalOpen(true);
                  }}
                  className="w-full py-2 flex items-center justify-center space-x-2 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-xl transition-all border border-dashed border-transparent hover:border-gray-200"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-xs font-semibold">Add Task</span>
                </button>
              </div>
            </div>
          ))}
          
          <button className="flex flex-col w-80 shrink-0 bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl items-center justify-center text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-all h-24">
            <Plus className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold uppercase tracking-widest">Add List</span>
          </button>
        </div>
      </div>

      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">New Task</h2>
              <button onClick={() => setIsTaskModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
                <input name="title" required autoFocus className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black" placeholder="What needs to be done?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select name="priority" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assignee</label>
                  <select name="assigneeId" className="w-full px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-black">
                    <option value="">No Assignee</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="flex-1 py-2.5 border rounded-xl font-semibold hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardView;
