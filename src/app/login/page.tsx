'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const isLoggedIn = document.cookie.includes('auth=true');
    if (isLoggedIn) {
      router.replace('/chat');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Hardcoded credentials for demo
    const validCredentials = [
      { username: 'sirtheprogrammer', password: '013199' },
      { username: 'leylah', password: '013199' }
    ];

    const isValid = validCredentials.some(
      cred => cred.username === username && cred.password === password
    );

    if (isValid) {
      try {
        // Set auth cookie and local storage
        document.cookie = 'auth=true; path=/';
        localStorage.setItem('username', username);
        
        toast.success('Login successful!');
        router.replace('/chat');
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Login failed. Please try again.');
      }
    } else {
      toast.error('Invalid credentials');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/90 via-pink-800/90 to-indigo-900/90 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 mx-4 bg-gradient-to-r from-purple-900/90 via-pink-800/90 to-indigo-900/90 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-700/30"
      >
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Welcome to Mood Chat
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 px-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Login
          </motion.button>
        </form>
        <div className="mt-6 text-center text-gray-400">
          <p>Demo Credentials:</p>
          <p>Username: sirtheprogrammer or leylah</p>
          <p>Password: 013199</p>
        </div>
      </motion.div>
    </div>
  );
}
