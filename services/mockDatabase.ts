
import { User, Board, List, Task, Activity } from '../types';

/**
 * DATABASE SCHEMA DESIGN (Conceptual)
 * 
 * Users Table: id (UUID), name (String), email (String, Unique), password_hash (String), avatar (URL)
 * Boards Table: id (UUID), title (String), owner_id (FK -> Users.id), created_at (Timestamp)
 * Lists Table: id (UUID), board_id (FK -> Boards.id), title (String), order (Int)
 * Tasks Table: id (UUID), list_id (FK -> Lists.id), board_id (FK -> Boards.id), title (String), description (Text), priority (Enum), assignee_id (FK -> Users.id, Nullable), created_at (Timestamp)
 * Activities Table: id (UUID), user_id (FK -> Users.id), type (Enum), details (Text), timestamp (Timestamp)
 */

const STORAGE_KEY = 'syncboard_db';

interface DB {
  users: User[];
  boards: Board[];
  lists: List[];
  tasks: Task[];
  activities: Activity[];
}

const initialDB: DB = {
  users: [
    { id: 'u1', name: 'John Doe', email: 'john@example.com', avatar: 'https://picsum.photos/seed/john/100' },
    { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', avatar: 'https://picsum.photos/seed/jane/100' },
  ],
  boards: [
    { id: 'b1', title: 'Product Roadmap', ownerId: 'u1', createdAt: Date.now() }
  ],
  lists: [
    { id: 'l1', boardId: 'b1', title: 'To Do', order: 0 },
    { id: 'l2', boardId: 'b1', title: 'In Progress', order: 1 },
    { id: 'l3', boardId: 'b1', title: 'Done', order: 2 }
  ],
  tasks: [
    { id: 't1', boardId: 'b1', listId: 'l1', title: 'Research competitors', description: 'Analyze top 5 market players.', priority: 'high', assigneeId: 'u1', createdAt: Date.now(), updatedAt: Date.now() },
    { id: 't2', boardId: 'b1', listId: 'l2', title: 'Design System', description: 'Create Figma components.', priority: 'medium', assigneeId: 'u2', createdAt: Date.now(), updatedAt: Date.now() }
  ],
  activities: []
};

export const getDB = (): DB => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : initialDB;
};

export const saveDB = (db: DB) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  // Simulate WebSocket broadcast for real-time updates across tabs
  const bc = new BroadcastChannel('syncboard_realtime');
  bc.postMessage('DATABASE_UPDATED');
};
