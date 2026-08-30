'use client';

import React, { useState, useEffect } from 'react';

export default function AuthHeader() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('adibot_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const userData = { email };
    localStorage.setItem('adibot_user', JSON.stringify(userData));
    setUser(userData);
    setIsModalOpen(false);
    setEmail('');
    setPassword('');
  };

  const handleLogout = () => {
    localStorage.removeItem('adibot_user');
    setUser(null);
  };

  return (
    <>
      <header className="flex justify-between items-center px-6 py-3 bg-slate-900 text-white border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-lg">
          🎓 <span>AdiBot</span>
        </div>
        
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm text-emerald-400 font-medium bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800">
                👤 {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-md text-xs font-semibold transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => { setIsSignUp(false); setIsModalOpen(true); }}
                className="bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md text-xs font-semibold text-slate-200"
              >
                Sign In
              </button>
              <button
                onClick={() => { setIsSignUp(true); setIsModalOpen(true); }}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md text-xs font-semibold text-white"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal (Login / Signup) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl w-full max-w-sm text-white shadow-2xl">
            <h2 className="text-xl font-bold mb-1">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              {isSignUp ? 'Sign up to start chatting with AdiBot' : 'Sign in to access your saved college chats'}
            </p>

            <form onSubmit={handleAuth} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="student@aditya.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg mt-2 transition"
              >
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-400 hover:underline"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
