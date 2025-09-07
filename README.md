# Riverside.fm Clone

A simplified clone of Riverside.fm built with React and Node.js. This application allows users to record high-quality audio and video directly in their browser using WebRTC and the MediaRecorder API.

## Features

- **Landing Page**: Create a new recording session with a single click
- **Studio Page**: Record audio and video using your camera and microphone
- **Playback Page**: View and play all your recordings
- **API Backend**: Save and retrieve recordings with Express

## Tech Stack

### Frontend
- React (with Vite)
- React Router for navigation
- Tailwind CSS for styling
- WebRTC for camera/microphone access
- MediaRecorder API for recording

### Backend
- Node.js with Express
- Multer for file uploads
- File system operations for storing recordings

## Project Structure

```
/frontend             # React application
  /src
    /components       # Reusable components
    /pages            # Page components
    App.jsx           # Main app component
    main.jsx          # Entry point

/backend              # Express server
  /uploads            # Stored recordings
  index.js            # Server entry point
  package.json        # Backend dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

### Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/riverside-clone.git
cd riverside-clone
```

2. Install backend dependencies:
```
cd backend
npm install
```

3. Install frontend dependencies:
```
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```
cd backend
npm run dev
```

2. In a new terminal, start the frontend development server:
```
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Building for Production

1. Build the frontend:
```
cd frontend
npm run build
```

2. Set the NODE_ENV environment variable to production when running the backend:
```
cd backend
NODE_ENV=production npm start
```

## License

MIT

## Acknowledgments

- This project is inspired by Riverside.fm but is a simplified clone for educational purposes
- Created as a portfolio project to demonstrate full-stack development skills
