export interface Message {
  id: string;
  text?: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  stickerId?: string;
  sender: string;
  timestamp: any;
  type: 'text' | 'image' | 'video' | 'audio' | 'sticker';
  isFavorite?: boolean;
}

export interface Sticker {
  id: string;
  url: string;
  createdBy: string;
  createdAt: string;
  category: 'custom' | 'public';
}

export interface UserProfile {
  username: string;
  avatarUrl?: string;
  status?: string;
  lastSeen?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}
