"use client";
import React from 'react';
import LeaderboardClient from '@/components/LeaderboardClient';

type User = { _id: string; name: string; email: string; image: string; score: number; createdAt: string };

export default function EnterPage() {
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [playerName, setPlayerName] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<User[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  const ADMIN_PASSWORD = 'evolvia2025'; // Predefined password

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError('');
    } else {
      setPasswordError('Invalid password. Please try again.');
      setPassword('');
    }
  };

  // Search for users when name changes
  React.useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (playerName.trim().length >= 2) {
        setSearchLoading(true);
        try {
          const res = await fetch(`/api/users/search?name=${encodeURIComponent(playerName.trim())}`);
          const data = await res.json();
          if (Array.isArray(data)) {
            setSearchResults(data);
          } else {
            setSearchResults([]);
          }
        } catch (err) {
          console.error('Failed to search users:', err);
          setSearchResults([]);
        } finally {
          setSearchLoading(false);
        }
      } else {
        setSearchResults([]);
        setSelectedUser(null);
      }
    }, 300); // Debounce for 300ms

    return () => clearTimeout(timeoutId);
  }, [playerName]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (!selectedUser) {
      setMessage('Please select a user first');
      return;
    }
    
    const fd = new FormData(e.currentTarget);
    const score = Number(fd.get('score'));
    
    if (Number.isNaN(score)) {
      setMessage('Invalid score');
      return;
    }
    
    setLoading(true);
    setMessage(null);
    
    try {
      const res = await fetch('/api/users/update-score', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedUser._id, score }),
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'unknown' }));
        setMessage('Error: ' + (err?.error || res.statusText));
      } else {
        setMessage(`Score updated for ${selectedUser.name}!`);
        (e.currentTarget as HTMLFormElement).reset();
        setPlayerName('');
        setSearchResults([]);
        setSelectedUser(null);
        window.dispatchEvent(new CustomEvent('users:changed'));
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className={`h-screen w-screen flex items-center justify-center bg-black text-white transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`max-w-xl w-full p-6 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {!isAuthenticated ? (
          <div className="text-center">
            <h1 className="text-3xl font-semibold mb-6">Admin Access Required</h1>
            <p className="text-white/70 mb-6">Please enter the admin password to access the score management system.</p>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full p-3 rounded bg-white/5 border border-white/10 text-center"
                  required
                />
              </div>
              
              {passwordError && (
                <div className="text-red-400 text-sm">{passwordError}</div>
              )}
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-semibold">Enter Marks</h1>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="px-3 py-1 bg-red-500/20 text-red-300 rounded text-sm hover:bg-red-500/30 transition-colors"
              >
                Logout
              </button>
            </div>
        <div className="space-y-4">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <input 
                name="playerName" 
                placeholder="Search player name..." 
                className="w-full p-3 rounded bg-white/5 border border-white/10"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              
              {/* Search Results */}
              {playerName.length >= 2 && (
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-md max-h-48 overflow-y-auto">
                  {searchLoading ? (
                    <div className="p-3 text-center text-white/70">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-1">
                      {searchResults.map((user) => (
                        <button
                          key={user._id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(user);
                            setPlayerName(user.name);
                            setSearchResults([]);
                          }}
                          className="w-full p-3 text-left hover:bg-white/10 transition-colors flex items-center gap-3"
                        >
                          <img 
                            src={user.image} 
                            alt={user.name}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-white/60">{user.email} • Score: {user.score}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 text-center text-white/50">No users found</div>
                  )}
                </div>
              )}
            </div>

            {/* Selected User */}
            {selectedUser && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-md p-4">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={selectedUser.image} 
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{selectedUser.name}</div>
                    <div className="text-sm text-white/60">Current Score: {selectedUser.score}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <input 
                name="score" 
                required 
                type="number" 
                placeholder="Points to add" 
                className="flex-1 p-3 rounded bg-white/5 border border-white/10"
                disabled={!selectedUser}
              />
              <button 
                disabled={loading || !selectedUser} 
                className="px-6 py-3 bg-white text-black rounded disabled:opacity-50 font-medium"
              >
                {loading ? 'Adding...' : 'Add Points'}
              </button>
            </div>
            <p className="text-sm text-white/60">
              Search and select a player, then enter points to add to their score
            </p>
          </form>

          {message && <div className="text-sm text-white/70">{message}</div>}

          <div>
            <LeaderboardClient />
          </div>
        </div>
          </>
        )}
      </div>
    </section>
  );
}
