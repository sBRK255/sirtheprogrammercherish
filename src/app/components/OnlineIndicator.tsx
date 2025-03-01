'use client';

import { motion } from 'framer-motion';

interface OnlineIndicatorProps {
  isOnline: boolean;
  lastSeen?: string;
}

const OnlineIndicator: React.FC<OnlineIndicatorProps> = ({ isOnline, lastSeen }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <motion.div
          className={`w-2.5 h-2.5 rounded-full ${
            isOnline ? 'bg-green-500' : 'bg-gray-400'
          }`}
          animate={{
            scale: isOnline ? [1, 1.2, 1] : 1,
            opacity: isOnline ? 1 : 0.7,
          }}
          transition={{
            repeat: isOnline ? Infinity : 0,
            duration: 2,
          }}
        />
        {isOnline && (
          <motion.div
            className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500"
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
          />
        )}
      </div>
      <span className="text-xs text-gray-300">
        {isOnline ? 'Online' : lastSeen ? `Last seen ${lastSeen}` : 'Offline'}
      </span>
    </div>
  );
};

export default OnlineIndicator;
