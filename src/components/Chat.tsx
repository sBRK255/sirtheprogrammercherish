'use client';

import { useState, useRef, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { uploadFile, deleteFile } from '@/lib/supabase';

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: any;
  type: 'text' | 'voice' | 'image';
  attachmentUrl?: string;
}

interface ChatProps {
  currentUser: {
    username: string;
  };
}

export default function Chat({ currentUser }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(newMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    await addDoc(collection(db, 'messages'), {
      content: newMessage,
      senderId: currentUser.username,
      timestamp: serverTimestamp(),
      type: 'text'
    });

    setNewMessage('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileType = file.type.startsWith('image/') ? 'images' : 'voice-messages';
      const path = `${fileType}/${currentUser.username}/${Date.now()}-${file.name}`;
      const url = await uploadFile(fileType, path, file);

      if (url) {
        await addDoc(collection(db, 'messages'), {
          content: file.name,
          senderId: currentUser.username,
          timestamp: serverTimestamp(),
          type: file.type.startsWith('image/') ? 'image' : 'voice',
          attachmentUrl: url
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // Add voice recording logic here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Add voice recording stop logic here
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUser.username ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md p-4 rounded-lg ${
                message.senderId === currentUser.username
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800'
              }`}
            >
              <div className="font-bold mb-1">{message.senderId}</div>
              {message.type === 'text' ? (
                <p>{message.content}</p>
              ) : message.type === 'image' ? (
                <img
                  src={message.attachmentUrl}
                  alt={message.content}
                  className="max-w-full rounded"
                />
              ) : (
                <audio controls src={message.attachmentUrl} className="w-full" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,audio/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
          >
            {isUploading ? 'Uploading...' : '📎'}
          </button>
          <button
            type="button"
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
          >
            🎤
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
