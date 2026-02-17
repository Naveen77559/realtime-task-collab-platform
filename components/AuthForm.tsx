
import React, { useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';

interface AuthFormProps {
  onLogin: (user: User) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('john@example.com');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.login(email);
      onLogin(user);
    } catch (err) {
      setError('Authentication failed. Try john@example.com');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white font-black text-4xl mx-auto mb-6 shadow-xl shadow-gray-200">
            S
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">SyncBoard</h1>
          <p className="text-gray-500 mt-2 font-medium">Real-time collaboration for modern teams.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Work Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-black focus:bg-white transition-all text-lg"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-widest">Password</label>
              <a href="#" className="text-xs font-bold text-gray-400 hover:text-black">Forgot?</a>
            </div>
            <input 
              type="password" 
              className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:border-black focus:bg-white transition-all text-lg"
              placeholder="••••••••"
              defaultValue="password123"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 py-3 rounded-xl border border-red-100">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 hover:shadow-gray-300 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 text-center space-y-4">
          <p className="text-sm text-gray-400">
            Don't have an account? <a href="#" className="text-black font-bold">Sign up for free</a>
          </p>
          <div className="pt-6 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-bold">Demo Credentials</p>
            <div className="mt-3 flex justify-center space-x-3">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600">john@example.com</span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600">jane@example.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
