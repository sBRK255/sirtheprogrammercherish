import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface MediaUploaderProps {
  type: 'image' | 'video' | 'audio';
  onUpload: (url: string) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ type, onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const { url } = await response.json();
      onUpload(url);
      toast.success(`${type} uploaded successfully!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Failed to upload ${type}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    if (type === 'video' && !file.type.startsWith('video/')) {
      toast.error('Please select a video file');
      return;
    }
    if (type === 'audio' && !file.type.startsWith('audio/')) {
      toast.error('Please select an audio file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    handleUpload(file);
  };

  return (
    <input
      ref={inputRef}
      type="file"
      accept={`${type}/*`}
      onChange={handleFileSelect}
      className="hidden"
    />
  );
};

export default MediaUploader;
