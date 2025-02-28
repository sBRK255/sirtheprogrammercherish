'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import components that use Firebase
const Auth = dynamic(() => import('@/components/Auth'), {
  ssr: false,
});

const Chat = dynamic(() => import('@/components/Chat'), {
  ssr: false,
});

export default function Home() {
  const [user, setUser] = useState<string | null>(null);

  const handleLogin = (username: string) => {
    setUser(username);
  };

  return (
    <main className="min-h-screen">
      {!user ? (
        <Auth onLogin={handleLogin} />
      ) : (
        <Chat currentUser={{ username: user }} />
      )}
    </main>
  );
}
