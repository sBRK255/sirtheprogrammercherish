import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define which paths are protected (require auth)
const protectedPaths = ['/chat']

// Define public paths that don't need auth
const publicPaths = ['/', '/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoggedIn = request.cookies.has('auth')

  // Handle protected routes
  if (protectedPaths.includes(pathname)) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }

  // Handle public routes
  if (publicPaths.includes(pathname)) {
    // If logged in, redirect from public routes to chat
    if (isLoggedIn && pathname !== '/chat') {
      return NextResponse.redirect(new URL('/chat', request.url))
    }
    return NextResponse.next()
  }

  // For all other routes, just proceed
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/login', '/chat']
}
