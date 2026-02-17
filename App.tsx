
import React, { useState, useEffect, useCallback } from 'react';
import { User, Board, AuthState } from './types';
import { api, onRealTimeUpdate } from './services/api';
import AuthForm from './components/AuthForm';
import Navbar from './components/Navbar';
import BoardView from './components/BoardView';
import ActivitySidebar from './components/ActivitySidebar';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('syncboard_auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    localStorage.setItem('syncboard_auth', JSON.stringify(auth));
  }, [auth]);

  // Real-time synchronization
  useEffect(() => {
    const cleanup = onRealTimeUpdate(() => {
      setRefreshTrigger(prev => prev + 1);
    });
    return cleanup;
  }, []);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    setActiveBoardId(null);
  };

  if (!auth.isAuthenticated) {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Navbar 
        user={auth.user!} 
        onLogout={handleLogout} 
        onGoHome={() => setActiveBoardId(null)}
      />
      
      <main className="flex flex-1 overflow-hidden relative">
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeBoardId ? (
            <BoardView 
              boardId={activeBoardId} 
              userId={auth.user!.id}
              refreshTrigger={refreshTrigger}
            />
          ) : (
            <Dashboard 
              userId={auth.user!.id} 
              onSelectBoard={setActiveBoardId}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>
        
        <ActivitySidebar refreshTrigger={refreshTrigger} />
      </main>
    </div>
  );
};

export default App;
