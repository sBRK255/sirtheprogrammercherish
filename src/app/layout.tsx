import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mood Chat App',
  description: 'A beautiful chat app with mood indicators',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-indigo-900">
          <Toaster position="top-right" />
          {children}
        </main>
      </body>
    </html>
  )
}
