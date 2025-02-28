'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LoadingSpinner from './LoadingSpinner';

interface AuthProps {
  onLogin: (username: string) => void;
}

const USERS = {
  'sirtheprogrammer': {
    email: 'sirtheprogrammer@moodchat.com',
    password: '013199'
  },
  'leylah': {
    email: 'leylah@moodchat.com',
    password: '0131'
  }
};

export default function Auth({ onLogin }: AuthProps) {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (username: string) => {
    setLoading(true);
    setError('');
    
    try {
      const user = USERS[username as keyof typeof USERS];
      if (!user) {
        throw new Error('Invalid user');
      }

      await signInWithEmailAndPassword(auth, user.email, user.password);
      onLogin(username);
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Choose Your User</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {Object.keys(USERS).map((username) => (
            <button
              key={username}
              onClick={() => handleLogin(username)}
              disabled={loading}
              className={`w-full p-4 rounded transition ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {loading && selectedUser === username ? (
                <span>Logging in...</span>
              ) : (
                <span className="capitalize">{username}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
