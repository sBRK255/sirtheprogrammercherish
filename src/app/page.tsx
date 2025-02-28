'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import dynamic from 'next/dynamic';
import Auth from '../components/Auth';

const Chat = dynamic(() => import('../components/Chat'), { ssr: false });

export default function Home() {
  const [user, setUser] = useState<{ username: string } | null>(null);

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-purple-400 to-pink-500">
      <div className="container mx-auto p-4 flex gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold mb-4">Mood Booster</h1>
            {/* Mood Booster content will go here */}
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-1/3"
        >
          <Chat currentUser={user} />
        </motion.div>
      </div>
    </div>
  );
}
