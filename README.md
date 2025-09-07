
<div align="center">

# 🎙️ Riverside Clone — Browser-based Recording Studio

Clean, modern, and resume-ready clone of Riverside.fm. Record high‑quality audio/video in the browser using WebRTC and the MediaRecorder API, save to a Node/Express backend, and replay your recordings with a simple, elegant UI.

![React](https://img.shields.io/badge/Frontend-React_18-61DAFB?logo=react&logoColor=061E26)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=fff)
![Tailwind](https://img.shields.io/badge/Styles-Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=fff)
![Express](https://img.shields.io/badge/Backend-Express-000?logo=express&logoColor=fff)
![Multer](https://img.shields.io/badge/Uploads-Multer-00BDA6)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

</div>

## ✨ What’s inside

- Landing page with a “Start Studio” flow that routes to a unique session: `/studio/:id`
- Studio page to preview camera/mic (WebRTC), start/stop a recording (MediaRecorder), and upload the result
- Playback page that lists saved recordings from the backend and plays them in a `<video>` tag
- Express API to upload and list recordings, with static serving of uploaded files and production build
- Vite proxy for smooth local dev: frontend → backend (http://localhost:5000)

---

## 🧭 Architecture Overview

```
┌──────────────┐        Media (getUserMedia)        ┌──────────────┐
│   Frontend   │  ───────────────────────────────▶  │   Browser    │
│   (Vite)     │                                    │  Camera/Mic  │
│ React + RW   │ ◀── Recording (MediaRecorder) ──── │   Streams    │
└─────┬────────┘                                    └──────┬───────┘
      │  Upload (multipart/form-data)                      │
      ▼                                                    │
┌──────────────┐    Filesystem (./backend/uploads)         │
│   Backend    │ ◀──────────────────────────────────────────┘
│ Express API  │  /api/upload  /api/recordings
└──────────────┘
```

Tech summary:
- WebRTC (getUserMedia) for live camera/mic preview
- MediaRecorder API for chunked recording (WebM by default), uploaded via `FormData`
- Multer saves files to `/backend/uploads`, served at `/uploads/*`
- React Router for routing, Tailwind for minimal-yet-clean UI

---

## 🧩 Features

- Landing: “Start Studio” creates a random session and navigates to `/studio/:id`
- Studio:
  - Live camera/mic preview
  - Start/Stop recording controls with a timer
  - Progress UI while uploading to the backend
- Playback:
  - Fetch `/api/recordings` and list all saved items
  - Play any recording in a native `<video>` player
  - Download recording
- Production-ready serving: Express can serve the built frontend and uploads

---

## 📁 Project Structure

```
riverside-clone/
├─ frontend/                 # React app (Vite + Tailwind)
│  ├─ src/
│  │  ├─ components/        # Reusable UI (Navbar, etc.)
│  │  ├─ pages/             # Home, Studio, Playback
│  │  ├─ App.jsx            # Routes
│  │  └─ main.jsx           # Entry
│  ├─ index.html
│  └─ tailwind.config.js
│
├─ backend/                  # Express API
│  ├─ uploads/              # Saved recordings (served at /uploads)
│  ├─ index.js              # API routes & static serving
│  └─ package.json
│
└─ README.md
```

---

## 🚀 Getting Started (Windows PowerShell)

Prerequisites:
- Node.js 18+ (LTS recommended)
- PowerShell 5.1+ (default on Windows)

1) Backend — install & run

```powershell
cd backend
npm install
npm run dev
```

This starts Express at http://localhost:5000 and serves uploads at http://localhost:5000/uploads/…

2) Frontend — install & run (new terminal)

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal (usually http://localhost:5173).

Notes:
- The Vite dev server proxies `/api` and `/uploads` to http://localhost:5000 for local development.
- Allow camera/mic permissions when prompted by the browser.

---

## 🕹️ How to Use

1. Go to Home and click “Start Studio” → you’ll be routed to `/studio/:id`
2. Grant camera/microphone access to see your live preview
3. Click “Start Recording” → record → “Stop Recording”
4. The recording uploads to the backend automatically
5. Open the “Recordings” page to browse and play your files

---

## 📡 API Reference

Base URL (dev): `http://localhost:5000`

### POST /api/upload
Accepts a multipart/form-data upload with a single field `recording`.

Response:
```json
{
  "message": "File uploaded successfully",
  "filename": "recording_1694092800000.webm",
  "path": "/uploads/recording_1694092800000.webm"
}
```

### GET /api/recordings
Returns a list of saved files.

```json
[
  {
    "id": "1694092800000",
    "filename": "recording_1694092800000.webm",
    "url": "/uploads/recording_1694092800000.webm",
    "date": "2025-09-07T09:45:00.000Z"
  }
]
```

---

## 📦 Production Build

1) Build the frontend
```powershell
cd frontend
npm run build
```

2) Run backend in production (serves the built frontend)
```powershell
cd ../backend
$env:NODE_ENV = "production"; npm start
```

Navigate to your backend URL (default http://localhost:5000). Express serves the compiled frontend and the `uploads` directory.

---

## 🧰 Troubleshooting

- Camera/Mic not showing: Ensure you allowed permissions. Try refreshing the page or testing in Chrome/Edge.
- Recording not supported: Some browsers have limited MediaRecorder support. WebM is the default; fallback logic attempts a generic type.
- CORS issues: The Vite dev proxy handles `/api` and `/uploads`. Make sure the backend is on port 5000.
- Port in use: Stop other processes or change ports in `vite.config.js`/backend as needed.
- HTTPS note: getUserMedia works on `http://localhost` without HTTPS, but requires HTTPS on remote hosts.

---

## 🗺️ Roadmap (Nice-to-haves)

- Multi-participant rooms with WebRTC peer connections
- Per-track recording (local + server-side mixing)
- Waveform/timeline UI and simple trims
- Auth and private recordings
- Cloud storage integration (S3, GCS)

---

## 📜 License

MIT — use freely for learning and portfolio work.

## 🙌 Acknowledgments

Inspired by Riverside.fm. This project is a simplified educational clone to demonstrate full‑stack development with modern tooling.
