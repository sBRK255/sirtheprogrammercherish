import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from './supabase';

export const uploadMedia = async (file: File, type: 'image' | 'audio'): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}_${uuidv4()}.${fileExtension}`;
    const bucket = type === 'image' ? 'images' : 'voice-messages';
    
    const url = await uploadFile(bucket, fileName, file);
    if (!url) {
      throw new Error(`Failed to upload ${type}`);
    }
    
    return url;
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    throw error;
  }
};

export const startRecording = async (): Promise<MediaRecorder> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    return mediaRecorder;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    throw error;
  }
};

export const stopRecording = (mediaRecorder: MediaRecorder): Promise<Blob> => {
  return new Promise((resolve) => {
    const chunks: Blob[] = [];
    
    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      resolve(blob);
    };
    
    mediaRecorder.stop();
  });
};
