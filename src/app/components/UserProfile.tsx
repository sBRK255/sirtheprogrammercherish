import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaSignOutAlt, FaUserCircle, FaEnvelope } from 'react-icons/fa';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  username: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose, onLogout, username }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="relative h-32 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white hover:scale-110 transition-transform"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              
              {/* Avatar */}
              <div className="relative -mt-16 flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center">
                  <FaUserCircle className="w-24 h-24 text-white" />
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                  {username}
                </h2>
                <p className="text-gray-500 mt-2 flex items-center justify-center gap-2">
                  <FaEnvelope />
                  {username}@moodchat.com
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-500">24</div>
                    <div className="text-sm text-gray-500">Messages</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-500">12</div>
                    <div className="text-sm text-gray-500">Stickers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">5</div>
                    <div className="text-sm text-gray-500">Media</div>
                  </div>
                </div>
                
                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onLogout}
                  className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                >
                  <FaSignOutAlt />
                  Logout
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default UserProfile;
