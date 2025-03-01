import { NextResponse } from 'next/server';

// In-memory message store for development
let messages: any[] = [];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lastTimestamp = searchParams.get('lastTimestamp');

    let filteredMessages = [...messages];
    if (lastTimestamp) {
      filteredMessages = messages.filter(msg => 
        new Date(msg.timestamp).getTime() > new Date(lastTimestamp).getTime()
      );
    }

    // Only return the last 50 messages
    filteredMessages = filteredMessages.slice(-50);

    return NextResponse.json({ messages: filteredMessages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { text, username, type = 'text', stickerUrl } = await request.json();
    
    const newMessage = {
      id: Date.now().toString(),
      text,
      username,
      type,
      stickerUrl,
      timestamp: new Date().toISOString(),
    };

    messages.push(newMessage);
    
    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
