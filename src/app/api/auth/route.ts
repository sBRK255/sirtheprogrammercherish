import { NextResponse } from 'next/server';

const VALID_USERS = [
  { username: 'sirtheprogrammer', email: 'sirtheprogrammer@moodchat.com', password: '013199' },
  { username: 'leylah', email: 'leylah@moodchat.com', password: '013199' }
];

// In-memory message store (replace with database in production)
let messages: any[] = [];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const user = VALID_USERS.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Create a session cookie that expires in 24 hours
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        username: user.username,
        email: user.email 
      }
    });

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'auth_session',
      value: JSON.stringify({ username: user.username, email: user.email }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const authCookie = request.headers.get('cookie')?.split(';')
      .find(c => c.trim().startsWith('auth_session='));
    
    if (!authCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const sessionData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
    
    return NextResponse.json({ 
      success: true, 
      user: sessionData 
    });

  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json({ error: 'Session validation failed' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const response = NextResponse.json({ success: true });
  
  // Clear the auth cookie
  response.cookies.set({
    name: 'auth_session',
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0
  });

  return response;
}
