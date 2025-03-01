'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = document.cookie.includes('auth=true');
    
    // Redirect based on auth status
    if (isLoggedIn) {
      router.replace('/chat');
    } else {
      router.replace('/login');
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/90 via-pink-800/90 to-indigo-900/90 backdrop-blur-sm">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
