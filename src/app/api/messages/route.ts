import { NextResponse } from 'next/server';

// In-memory stores (replace with database in production)
let messages: any[] = [];
let typingUsers: { username: string; timestamp: number }[] = [];

export async function GET(request: Request) {
  // Clean up old typing indicators (older than 3 seconds)
  const now = Date.now();
  typingUsers = typingUsers.filter(user => now - user.timestamp < 3000);
  
  return NextResponse.json({ 
    messages,
    typingUsers: typingUsers.map(u => u.username)
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Handle typing status update
    if (body.type === 'typing') {
      const existingIndex = typingUsers.findIndex(u => u.username === body.username);
      if (existingIndex !== -1) {
        typingUsers[existingIndex].timestamp = Date.now();
      } else {
        typingUsers.push({ username: body.username, timestamp: Date.now() });
      }
      return NextResponse.json({ success: true });
    }
    
    // Handle regular messages
    const message = {
      ...body,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    // Remove typing status when sending a message
    typingUsers = typingUsers.filter(u => u.username !== body.username);
    
    messages.push(message);
    
    // Keep only last 100 messages
    if (messages.length > 100) {
      messages = messages.slice(-100);
    }
    
    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Message error:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
