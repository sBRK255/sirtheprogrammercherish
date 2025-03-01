'use client';

import { motion } from 'framer-motion';
import { FaSmile } from 'react-icons/fa';

const STICKERS = [
  { url: '/stickers/happy.png', name: 'Happy' },
  { url: '/stickers/love.png', name: 'Love' },
  { url: '/stickers/laugh.png', name: 'Laugh' },
  { url: '/stickers/cool.png', name: 'Cool' },
  { url: '/stickers/wink.png', name: 'Wink' },
  { url: '/stickers/party.png', name: 'Party' },
  { url: '/stickers/sad.png', name: 'Sad' },
  { url: '/stickers/angry.png', name: 'Angry' },
];

interface StickerPickerProps {
  onStickerSelect: (stickerUrl: string) => void;
}

const StickerPicker: React.FC<StickerPickerProps> = ({ onStickerSelect }) => {
  return (
    <motion.div 
      className="bg-gray-900/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-gray-700/30"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <div className="grid grid-cols-4 gap-2 w-48">
        {STICKERS.map((sticker) => (
          <motion.button
            key={sticker.url}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStickerSelect(sticker.url)}
            className="w-10 h-10 bg-gray-800/50 rounded-lg p-1.5 hover:bg-gray-800/80 transition-colors group"
            title={sticker.name}
          >
            <img 
              src={sticker.url} 
              alt={sticker.name}
              className="w-full h-full object-contain group-hover:scale-110 transition-transform"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${sticker.name.toLowerCase()}_face&backgroundColor=transparent&mood=${sticker.name.toLowerCase()}`;
              }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default StickerPicker;
