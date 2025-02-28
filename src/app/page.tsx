'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamically import components with no SSR
const Auth = dynamic(() => import('@/components/Auth'), { ssr: false });
const Chat = dynamic(() => import('@/components/Chat'), { ssr: false });

export default function Home() {
  const [currentUser, setCurrentUser] = useState<{ username: string } | null>(null);

  const handleLogin = (username: string) => {
    setCurrentUser({ username });
  };

  return (
    <main className="min-h-screen">
      {!currentUser ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Chat currentUser={currentUser} />
      )}
    </main>
  );
}
