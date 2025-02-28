import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import LoadingSpinner from './LoadingSpinner';

interface AuthProps {
  onLogin: (user: { username: string }) => void;
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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const userConfig = USERS[username as keyof typeof USERS];
    if (!userConfig) {
      setError('Invalid username');
      setIsLoading(false);
      return;
    }

    if (password !== userConfig.password) {
      setError('Invalid password');
      setIsLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, userConfig.email, userConfig.password);
      onLogin({ username });
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-500">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to Chat</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Enter password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition-colors"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-sm text-gray-600">
          <p>Available users:</p>
          <ul className="list-disc list-inside">
            <li>Username: sirtheprogrammer, Password: 013199</li>
            <li>Username: leylah, Password: 0131</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
