# Mood Chat App

A real-time chat application with mood boosting features, built with Next.js, Firebase, and Tailwind CSS. This app allows private chat between users with features like voice messages, emoji support, and typing indicators.

## Features

- Real-time private chat between users
- Voice message recording and playback
- Emoji picker support
- Typing indicators
- Image sharing
- Online/offline status
- Beautiful UI with animations using Framer Motion

## Prerequisites

Before you begin, ensure you have:
- Node.js installed (v18 or higher)
- A Firebase account and project set up
- Git installed (for version control)

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mood-chat-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Deployment on Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and sign up/login
3. Click "Import Project" and select your GitHub repository
4. Add your environment variables in the Vercel dashboard
5. Deploy!

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Firebase](https://firebase.google.com/) - Backend and real-time database
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [WaveSurfer.js](https://wavesurfer-js.org/) - Audio visualization
- [Emoji Picker React](https://github.com/ealush/emoji-picker-react) - Emoji selection

## License

This project is licensed under the MIT License.
