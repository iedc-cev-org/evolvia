"use client";
import React from 'react';
import LeaderboardClient from '@/components/LeaderboardClient';
import { useSession } from 'next-auth/react';

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={`min-h-screen w-screen bg-black text-white py-16 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className={`max-w-4xl mx-auto px-6 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Game Leaderboard</h1>
          {session && (
            <div className="flex items-center gap-3">
              <img 
                src={session.user?.image || ''} 
                alt={session.user?.name || ''} 
                className="w-8 h-8 rounded-full"
              />
              <div className="text-right">
                <div className="text-xs font-medium">{session.user?.name}</div>
                <div className="text-xs text-white/60">{session.user?.email}</div>
              </div>
            </div>
          )}
        </div>
        <LeaderboardClient />
      </div>
    </section>
  );
}
