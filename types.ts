
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
};

export type TaskPriority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  listId: string;
  boardId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  assigneeId?: string;
  createdAt: number;
  updatedAt: number;
};

export type List = {
  id: string;
  boardId: string;
  title: string;
  order: number;
};

export type Board = {
  id: string;
  title: string;
  ownerId: string;
  createdAt: number;
};

export type Activity = {
  id: string;
  userId: string;
  userName: string;
  type: 'TASK_CREATE' | 'TASK_MOVE' | 'TASK_DELETE' | 'TASK_UPDATE' | 'BOARD_CREATE';
  details: string;
  timestamp: number;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

export type BoardData = {
  board: Board;
  lists: List[];
  tasks: Task[];
};
