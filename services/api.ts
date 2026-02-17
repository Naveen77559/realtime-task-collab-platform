
import { User, Board, List, Task, Activity, BoardData } from '../types';
import { getDB, saveDB } from './mockDatabase';

// Real-time listener registration
export const onRealTimeUpdate = (callback: () => void) => {
  const bc = new BroadcastChannel('syncboard_realtime');
  bc.onmessage = () => callback();
  return () => bc.close();
};

export const api = {
  // Auth
  login: async (email: string): Promise<User> => {
    const db = getDB();
    const user = db.users.find(u => u.email === email);
    if (!user) throw new Error('User not found');
    return user;
  },

  getUsers: async (): Promise<User[]> => {
    return getDB().users;
  },

  // Boards
  getBoards: async (): Promise<Board[]> => {
    return getDB().boards;
  },

  getBoardDetails: async (boardId: string): Promise<BoardData> => {
    const db = getDB();
    const board = db.boards.find(b => b.id === boardId);
    if (!board) throw new Error('Board not found');
    
    return {
      board,
      lists: db.lists.filter(l => l.boardId === boardId).sort((a, b) => a.order - b.order),
      tasks: db.tasks.filter(t => t.boardId === boardId)
    };
  },

  createBoard: async (title: string, userId: string): Promise<Board> => {
    const db = getDB();
    const newBoard: Board = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      ownerId: userId,
      createdAt: Date.now()
    };
    db.boards.push(newBoard);
    // Auto-create default lists
    const defaultLists = ['To Do', 'In Progress', 'Done'].map((t, i) => ({
      id: Math.random().toString(36).substr(2, 9),
      boardId: newBoard.id,
      title: t,
      order: i
    }));
    db.lists.push(...defaultLists);
    
    api.logActivity(userId, 'BOARD_CREATE', `Created board "${title}"`);
    saveDB(db);
    return newBoard;
  },

  // Tasks
  createTask: async (task: Partial<Task>, userId: string): Promise<Task> => {
    const db = getDB();
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      boardId: task.boardId!,
      listId: task.listId!,
      title: task.title || 'Untitled Task',
      description: task.description || '',
      priority: task.priority || 'medium',
      assigneeId: task.assigneeId,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    db.tasks.push(newTask);
    api.logActivity(userId, 'TASK_CREATE', `Created task "${newTask.title}"`);
    saveDB(db);
    return newTask;
  },

  updateTask: async (taskId: string, updates: Partial<Task>, userId: string): Promise<Task> => {
    const db = getDB();
    const index = db.tasks.findIndex(t => t.id === taskId);
    if (index === -1) throw new Error('Task not found');
    
    const oldTask = db.tasks[index];
    const updatedTask = { ...oldTask, ...updates, updatedAt: Date.now() };
    db.tasks[index] = updatedTask;
    
    api.logActivity(userId, 'TASK_UPDATE', `Updated task "${updatedTask.title}"`);
    saveDB(db);
    return updatedTask;
  },

  moveTask: async (taskId: string, newListId: string, userId: string): Promise<void> => {
    const db = getDB();
    const task = db.tasks.find(t => t.id === taskId);
    const list = db.lists.find(l => l.id === newListId);
    if (!task || !list) return;

    const oldList = db.lists.find(l => l.id === task.listId);
    task.listId = newListId;
    task.updatedAt = Date.now();
    
    api.logActivity(userId, 'TASK_MOVE', `Moved "${task.title}" from ${oldList?.title} to ${list.title}`);
    saveDB(db);
  },

  deleteTask: async (taskId: string, userId: string): Promise<void> => {
    const db = getDB();
    const task = db.tasks.find(t => t.id === taskId);
    db.tasks = db.tasks.filter(t => t.id !== taskId);
    if (task) {
      api.logActivity(userId, 'TASK_DELETE', `Deleted task "${task.title}"`);
    }
    saveDB(db);
  },

  // Activity
  logActivity: (userId: string, type: Activity['type'], details: string) => {
    const db = getDB();
    const user = db.users.find(u => u.id === userId);
    const activity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName: user?.name || 'Unknown',
      type,
      details,
      timestamp: Date.now()
    };
    db.activities.unshift(activity); // Newest first
    saveDB(db);
  },

  getActivities: async (page: number = 0, limit: number = 10): Promise<{ activities: Activity[], total: number }> => {
    const db = getDB();
    const start = page * limit;
    return {
      activities: db.activities.slice(start, start + limit),
      total: db.activities.length
    };
  }
};
