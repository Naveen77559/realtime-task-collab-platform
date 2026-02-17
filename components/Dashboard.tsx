
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Board } from '../types';
import { Plus, Clock, Layout, ArrowRight } from 'lucide-react';

interface DashboardProps {
  userId: string;
  onSelectBoard: (id: string) => void;
  refreshTrigger: number;
}

const Dashboard: React.FC<DashboardProps> = ({ userId, onSelectBoard, refreshTrigger }) => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await api.getBoards();
        setBoards(data);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoards();
  }, [refreshTrigger]);

  const handleCreateBoard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return;
    const board = await api.createBoard(newBoardTitle, userId);
    setBoards(prev => [...prev, board]);
    setNewBoardTitle('');
    setShowCreateModal(false);
    onSelectBoard(board.id);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workspace</h1>
          <p className="text-gray-500 mt-1">Manage your team's boards and projects.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">New Board</span>
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-200 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map(board => (
            <div 
              key={board.id}
              onClick={() => onSelectBoard(board.id)}
              className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{board.title}</h3>
              <div className="flex items-center text-xs text-gray-400 space-x-4">
                <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {new Date(board.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>Admin: You</span>
              </div>
            </div>
          ))}

          <button 
            onClick={() => setShowCreateModal(true)}
            className="border-2 border-dashed border-gray-200 p-6 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-all group"
          >
            <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium">Add New Project</span>
          </button>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Create New Board</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleCreateBoard} className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Board Title</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newBoardTitle}
                  onChange={e => setNewBoardTitle(e.target.value)}
                  placeholder="e.g. Q4 Marketing Plan"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
                />
              </div>
              <div className="flex space-x-3">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
