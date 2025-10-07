"use client";
import React, { useEffect, useState } from 'react';

type User = { 
  _id: string; 
  name: string; 
  email: string; 
  image: string; 
  score: number; 
  createdAt: string;
  updatedAt: string;
};

export default function LeaderboardClient() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/users');
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Check if the response has an error
      if (data.error) {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        throw new Error(errorMsg);
      }
      
      // Ensure data is an array
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('API response is not an array:', data);
        setError('Invalid data format received');
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setError(error instanceof Error ? error.message : 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
    const handler = () => { loadUsers(); };
    window.addEventListener('users:changed', handler as EventListener);
    return () => window.removeEventListener('users:changed', handler as EventListener);
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-md">
        <div className="text-center">Loading leaderboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-md">
        <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-300 font-medium mb-2">Database Connection Error</p>
            <p className="text-sm text-red-200">{error}</p>
          </div>
          <button 
            onClick={loadUsers}
            className="px-4 py-2 bg-white/10 rounded hover:bg-white/20 transition-colors mb-4"
          >
            Retry Connection
          </button>
          
          {/* Show demo data when database is unavailable */}
          <div className="text-left">
            <p className="text-sm text-white/60 mb-4">Showing demo data (database unavailable):</p>
            <ol className="space-y-4">
              <li className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg font-bold text-white/70 min-w-[2rem]">#1</span>
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">A</div>
                  <div>
                    <div className="text-lg font-medium">Alice Johnson</div>
                    <div className="text-sm text-white/60">alice@example.com</div>
                  </div>
                </div>
                <div className="text-xl font-bold">1250</div>
              </li>
              <li className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg font-bold text-white/70 min-w-[2rem]">#2</span>
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">B</div>
                  <div>
                    <div className="text-lg font-medium">Bob Smith</div>
                    <div className="text-sm text-white/60">bob@example.com</div>
                  </div>
                </div>
                <div className="text-xl font-bold">980</div>
              </li>
              <li className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-lg font-bold text-white/70 min-w-[2rem]">#3</span>
                  <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">C</div>
                  <div>
                    <div className="text-lg font-medium">Carol Wilson</div>
                    <div className="text-sm text-white/60">carol@example.com</div>
                  </div>
                </div>
                <div className="text-xl font-bold">750</div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full bg-white/5 backdrop-blur-md border border-white/10 text-white rounded-lg p-6 transform transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <h2 className="text-xl font-semibold mb-6 text-center">Rankings</h2>
      {!Array.isArray(users) || users.length === 0 ? (
        <div className="text-center text-white/70 py-8">No users found</div>
      ) : (
        <ol className="space-y-3">
          {users.map((user, idx) => (
            <li 
              key={user._id} 
              className={`flex items-center justify-between bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-500 transform ${
                isVisible ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-base font-bold text-white/70 min-w-[3rem] text-center">
                  #{idx + 1}
                </span>
                <img 
                  src={user.image} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-white/20"
                />
                <div className="flex-1">
                  <div className="text-base font-medium">{user.name}</div>
                  <div className="text-xs text-white/60">{user.email}</div>
                </div>
              </div>
              <div className="text-xl font-bold text-right min-w-[4rem]">{user.score}</div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
