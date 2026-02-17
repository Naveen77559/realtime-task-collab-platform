
import React from 'react';
import { Search, Bell, LogOut, Layout, User as UserIcon } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onLogout: () => void;
  onGoHome: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onGoHome }) => {
  return (
    <nav className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between z-30">
      <div 
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={onGoHome}
      >
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
          S
        </div>
        <span className="text-xl font-bold tracking-tight">SyncBoard</span>
      </div>

      <div className="flex-1 max-w-xl mx-12 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search tasks, boards..."
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-0 rounded-full py-2 pl-10 pr-4 text-sm transition-all"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

        <div className="flex items-center space-x-3 pl-2">
          <div className="flex flex-col items-end mr-1">
            <span className="text-sm font-semibold text-gray-900 leading-tight">{user.name}</span>
            <span className="text-xs text-gray-500">Engineer</span>
          </div>
          <img src={user.avatar} alt={user.name} className="w-9 h-9 rounded-full border border-gray-200 shadow-sm" />
          <button 
            onClick={onLogout}
            className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg text-gray-500 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
