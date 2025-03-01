import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaImage, FaSmile, FaUser, FaMicrophone, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import VoiceRecorder from './VoiceRecorder';
import StickerPicker from './StickerPicker';
import OnlineIndicator from './OnlineIndicator';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  username: string;
  type: 'text' | 'sticker' | 'image' | 'audio';
  content: string;
  timestamp: number;
}

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [username, setUsername] = useState('');
  const [otherUser] = useState('leylah');
  const [otherUserOnline] = useState(true);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const responseTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup timeouts on unmount
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTypingAndResponse = (userMessage: string) => {
    // Clear any existing timeouts
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (responseTimeoutRef.current) clearTimeout(responseTimeoutRef.current);

    // Start typing after a short delay
    setTimeout(() => {
      setOtherUserTyping(true);
    }, 500);

    // Generate response based on user message
    const response = generateResponse(userMessage);
    const typingDuration = Math.min(response.length * 50, 3000); // Typing speed simulation

    // Stop typing and send response after duration
    typingTimeoutRef.current = setTimeout(() => {
      setOtherUserTyping(false);
      
      responseTimeoutRef.current = setTimeout(() => {
        handleReceiveMessage(response);
      }, 300);
    }, typingDuration);
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Response patterns
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hey there! How are you doing? 😊';
    }
    if (lowerMessage.includes('how are you')) {
      return "I'm doing great, thanks for asking! How about you? 💫";
    }
    if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye')) {
      return 'Take care! Hope to chat again soon! 👋';
    }
    if (lowerMessage.includes('thank')) {
      return "You're welcome! Always happy to chat! 🌟";
    }
    if (lowerMessage.includes('?')) {
      return "That's an interesting question! Let me think about it... 🤔";
    }
    
    // Default responses
    const defaultResponses = [
      "That's interesting! Tell me more! 💭",
      "I see what you mean! 💫",
      "Really? That's fascinating! 🌟",
      "I totally get that! 💖",
      "Thanks for sharing that with me! 🌈"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      type: 'text',
      content: inputMessage.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Only simulate response if other user is online
    if (otherUserOnline) {
      simulateTypingAndResponse(inputMessage.trim());
    }
  };

  const handleReceiveMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username: otherUser,
      type: 'text',
      content: text,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleLogout = async () => {
    try {
      // Clear cookie and storage
      document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      localStorage.clear();
      sessionStorage.clear();
      
      toast.success('Logged out successfully!');
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  useEffect(() => {
    if (!username) {
      router.replace('/');
    }
  }, [username, router]);

  if (!username) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
        <div className="p-4 rounded-lg bg-gradient-to-r from-purple-900/90 via-pink-800/90 to-indigo-900/90 backdrop-blur-sm">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/90 via-pink-800/90 to-indigo-900/90 backdrop-blur-sm border-b border-gray-700/30">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-gray-300">{otherUser}</span>
            <div className="flex items-center gap-2">
              <OnlineIndicator isOnline={otherUserOnline} lastSeen="2 minutes ago" />
              {otherUserTyping && (
                <span className="text-sm text-gray-400 animate-pulse">typing...</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-gray-300">{username}</span>
            <OnlineIndicator isOnline={true} />
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="p-3 rounded-full bg-gradient-to-r from-pink-600 to-red-600 text-white hover:shadow-lg flex items-center gap-2"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-16 right-4 bg-gradient-to-r from-purple-900/95 via-pink-800/95 to-indigo-900/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-700/30 z-50"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <FaUser className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{username}</h3>
                <OnlineIndicator isOnline={true} />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-300">Email: {username.toLowerCase()}@moodchat.com</p>
              <p className="text-gray-300">Status: Active</p>
              <p className="text-gray-300">Member since: {new Date().toLocaleDateString()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.username === username ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-2xl ${
                message.username === username
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-100'
              }`}
            >
              <p className="break-words">{message.content}</p>
              <div className="text-xs text-gray-300 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-gradient-to-r from-purple-900/90 via-pink-800/90 to-indigo-900/90 backdrop-blur-sm border-t border-gray-700/30">
        <div className="flex items-center gap-2">
          {showVoiceRecorder ? (
            <VoiceRecorder
              onRecordingComplete={(audioBlob) => {
                const audioUrl = URL.createObjectURL(audioBlob);
                handleReceiveMessage(audioUrl);
              }}
              onCancel={() => setShowVoiceRecorder(false)}
            />
          ) : (
            <>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStickerPicker(!showStickerPicker)}
                className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg"
              >
                <FaSmile className="w-5 h-5" />
              </motion.button>
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800/50 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {inputMessage ? (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-lg"
                >
                  <FaPaperPlane className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowVoiceRecorder(true)}
                  className="p-3 rounded-full bg-gradient-to-r from-green-500 to-teal-500 text-white hover:shadow-lg"
                >
                  <FaMicrophone className="w-5 h-5" />
                </motion.button>
              )}
            </>
          )}
        </div>
        <AnimatePresence>
          {showStickerPicker && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-20 right-4"
            >
              <StickerPicker onStickerSelect={(stickerUrl) => handleReceiveMessage(stickerUrl)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chat;
