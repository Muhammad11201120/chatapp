# Chat App

A full-stack real-time chat application with authentication, online presence, and image messages. Built with React (Vite), Zustand, Tailwind/DaisyUI, Express, MongoDB, Socket.IO, and JWT auth.

## Features

- User authentication (signup, login, logout) with httpOnly JWT cookie
- Online presence indicator via Socket.IO
- One-to-one messaging with text and image support (Cloudinary)
- Chats and contacts lists
- Real-time updates for new messages
- Profile picture update
- Rate limiting and basic protection via Arcjet middleware (optional)

## Tech Stack

- Frontend: React, Vite, Zustand, React Router, TailwindCSS + DaisyUI, Axios, Socket.IO client
- Backend: Node.js, Express, Socket.IO, MongoDB (Mongoose), JWT, bcrypt, Cloudinary

## Monorepo Structure

```
chat-app/
  backend/
    src/
      controllers/
      lib/
      middleware/
      routes/
      models/
      server.js
    package.json
  frontend/
    public/
    src/
      components/
      store/
      lib/
    package.json
  package.json (root)
  README.md
```

## Prerequisites

- Node.js 20+ (repo declares engines >=20)
- MongoDB connection string
- Cloudinary account (for image uploads)

## Environment Variables

Create a `.env` file in `backend/` with:

```
# Required
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://...
CLIENT_URL=http://localhost:5173
PORT=3000
NODE_ENV=development

# Optional/integrations
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=...
EMAIL_FROM=your@email.com
EMAIL_FROM_NAME=Your Name
ARCJET_KEY=...
ARCJET_ENV=...
```

Frontend uses Vite. For local dev it points Axios to `http://localhost:3000/api` and Socket.IO to `http://localhost:3000`.

## Installation

From the repo root:

```bash
# Install backend deps
npm install --prefix backend
# Install frontend deps
npm install --prefix frontend
```

## Development

Run backend and frontend separately:

```bash
# Terminal 1 - backend
npm run dev --prefix backend

# Terminal 2 - frontend
npm run dev --prefix frontend
```

- Backend will start at `http://localhost:3000`.
- Frontend (Vite) will start at `http://localhost:5173`.

Ensure `CLIENT_URL` in backend env equals your frontend origin.

## Production

Build the frontend and serve via the backend server:

```bash
# build frontend
npm run build --prefix frontend
# start backend (serves frontend dist in production)
NODE_ENV=production node backend/src/server.js
```

Or use the root script (fix typo if needed):

```json
{
  "scripts": {
    "build": "npm install --prefix backend && npm install --prefix frontend && npm run build --prefix frontend",
    "start": "npm run start --prefix backend"
  }
}
```

Note: The root `package.json` currently has a `buid` typo; consider renaming to `build`.

On some hosts, ensure backend deps are installed before start:

```bash
npm ci --omit=dev --prefix backend
npm run start --prefix backend
```

## API Overview

Base URL: `/api`

Auth (`backend/src/routes/auth.route.js`)

- POST `/auth/signup`
- POST `/auth/login`
- POST `/auth/logout`
- PUT `/auth/update-profile` (protected)
- GET `/auth/check-auth` (protected)

Messages (`backend/src/routes/message.route.js`) – protected + rate-limited

- GET `/messages/contacts` – all users except current
- GET `/messages/chats` – users you have chatted with
- GET `/messages/:id` – messages with a specific user
- POST `/messages/send/:id` – send text/image message

## Realtime and Presence

Socket server: `backend/src/lib/socket.js`

- Authenticated via `socket.auth.middleware.js` using JWT from httpOnly cookie
- Tracks online users with `userSocketMap`
- Broadcasts `getOnlineUsers` with array of online user IDs
- Emits `newMessage` to receiver upon message creation

Frontend socket: `frontend/src/store/useAuthStore.js`

- Connects after auth success; listens to `getOnlineUsers` and stores IDs

Frontend chat store: `frontend/src/store/useChatStore.js`

- Subscribes to `newMessage`
- Plays notification only for incoming messages when sound is enabled

## Running Locally (Quick Start)

1. Configure `backend/.env` as above
2. Install deps:

```bash
npm i --prefix backend && npm i --prefix frontend
```

3. Start dev servers:

```bash
npm run dev --prefix backend
npm run dev --prefix frontend
```

4. Open `http://localhost:5173`

## Troubleshooting

- Socket not connecting / online users empty

  - Ensure login triggers `connectSocket()` (already fixed in `useAuthStore.login`)
  - `CLIENT_URL` must match frontend origin; backend CORS `credentials: true`
  - Verify the auth cookie is set and sent on websocket connection

- Audio not playing / DOMException

  - Ensure `frontend/public/sounds/notification.mp3` is a valid non-empty MP3
  - Hard refresh (Ctrl+F5). Check Network shows 200, non-zero size, `audio/mpeg`

- ERR_MODULE_NOT_FOUND: cookie-parser

  - Install backend deps before starting: `npm ci --omit=dev --prefix backend`
  - Ensure `backend/package-lock.json` is committed

- Images not uploading
  - Set Cloudinary env vars and verify network calls

## License

MIT
