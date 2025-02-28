import { useState, useEffect, useRef } from 'react';
import { db, storage, auth } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import dynamic from 'next/dynamic';
import VoiceMessage from './VoiceMessage';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface Message {
  id: string;
  content: string;
  type: 'text' | 'voice' | 'image';
  sender: string;
  timestamp: Date;
  read: boolean;
}

interface ChatProps {
  currentUser: {
    username: string;
  };
}

export default function Chat({ currentUser }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const otherUser = currentUser.username === 'sirtheprogrammer' ? 'leylah' : 'sirtheprogrammer';

  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('participants', 'array-contains', currentUser.username),
      orderBy('timestamp', 'asc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [currentUser.username]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (type: 'text' | 'voice' | 'image', content: string) => {
    if (!content.trim()) return;
    
    try {
      await addDoc(collection(db, 'messages'), {
        content,
        type,
        sender: currentUser.username,
        receiver: otherUser,
        participants: [currentUser.username, otherUser],
        timestamp: new Date(),
        read: false
      });
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleVoiceMessage = () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording logic here
    } else {
      setIsRecording(true);
      // Start recording logic here
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await sendMessage('image', url);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-lg shadow-lg">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chat with {otherUser}</h2>
        <button
          onClick={() => auth.signOut()}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === currentUser.username ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === currentUser.username 
                  ? 'bg-blue-500 text-white ml-auto' 
                  : 'bg-gray-200 mr-auto'
              }`}
            >
              {message.type === 'text' && <p>{message.content}</p>}
              {message.type === 'voice' && <VoiceMessage url={message.content} />}
              {message.type === 'image' && (
                <img src={message.content} alt="Shared image" className="max-w-full rounded" />
              )}
              <div className="text-xs opacity-75 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            😊
          </button>
          <button
            onClick={handleVoiceMessage}
            className={`p-2 rounded-full hover:bg-gray-100 ${isRecording ? 'text-red-500' : ''}`}
          >
            🎤
          </button>
          <label className="p-2 rounded-full hover:bg-gray-100 cursor-pointer">
            📎
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage('text', newMessage)}
            className="flex-1 border rounded-full px-4 py-2"
            placeholder="Type a message..."
          />
          <button
            onClick={() => sendMessage('text', newMessage)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
          >
            Send
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-20 right-4">
            <EmojiPicker onEmojiClick={(emojiData: any) => {
              setNewMessage(prev => prev + emojiData.emoji);
              setShowEmojiPicker(false);
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
