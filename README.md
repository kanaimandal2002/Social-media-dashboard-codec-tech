# Social Media Dashboard - MERN Stack

A complete social media platform built with MongoDB, Express.js, React.js, Node.js, and Socket.IO featuring real-time messaging, user profiles, engagement tracking, and analytics.

## Features

- User authentication (Register/Login)
- Create, like, and comment on posts
- Real-time messaging with WebSocket
- Follow/Unfollow users
- User profiles with statistics
- Analytics dashboard with charts
- Redis-based notifications
- Responsive design

## Tech Stack

- Backend: Node.js, Express.js, MongoDB, Socket.IO, Redis
- Frontend: React.js, Vite, Axios, Chart.js
- Real-time: Socket.IO
- Caching: Redis

## Project Structure

\`\`\`
social-media-dashboard/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── .env
\`\`\`

## Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- Redis (local or cloud)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to backend folder:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

2. Create `.env` file with your configuration

3. Start server:
   \`\`\`bash
   npm run dev
   \`\`\`

### Frontend Setup

1. Navigate to frontend folder:
   \`\`\`bash
   cd frontend
   npm install
   \`\`\`

2. Create `.env` file with API URL

3. Start development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Running the Application

### Terminal 1 - MongoDB
\`\`\`bash
mongod
\`\`\`

### Terminal 2 - Redis
\`\`\`bash
redis-server
\`\`\`

### Terminal 3 - Backend
\`\`\`bash
cd backend
npm run dev
\`\`\`

### Terminal 4 - Frontend
\`\`\`bash
cd frontend
npm run dev
\`\`\`

Access the app at: `http://localhost:5173`

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user

### Users
- GET `/api/users/profile/:userId` - Get user profile
- PUT `/api/users/profile` - Update profile
- GET `/api/users/search?q=query` - Search users

### Posts
- POST `/api/posts/create` - Create post
- GET `/api/posts/feed` - Get feed
- POST `/api/posts/:postId/like` - Like post
- DELETE `/api/posts/:postId` - Delete post

### Comments
- POST `/api/comments/:postId` - Add comment

### Messages
- POST `/api/messages/send` - Send message
- GET `/api/messages/conversation/:userId` - Get conversation

### Follows
- POST `/api/follows/:userId/follow` - Follow user
- POST `/api/follows/:userId/unfollow` - Unfollow user

### Analytics
- GET `/api/analytics/dashboard` - Get user analytics

## Features Detailed

### Real-time Messaging
- Uses Socket.IO for real-time bidirectional communication
- Messages stored in MongoDB and cached in Redis
- Live notifications on new messages

### Engagement Features
- Like posts with real-time updates
- Comment on posts with nested replies
- Follow users and see their content

### Analytics
- Track total posts, likes, and comments
- View follower statistics
- Pie chart visualization of engagement

### Redis Integration
- Caches messages for fast retrieval
- Stores notification events
- Session management

## Environment Variables

### Backend (.env)
\`\`\`
MONGODB_URI=mongodb://localhost:27017/social-media-db
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=
\`\`\`

### Frontend (.env)
\`\`\`
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
\`\`\`

## Development

- Run backend with nodemon for hot reload
- Frontend has Vite hot module replacement
- Use Redux DevTools for state debugging

## Support

For issues and questions, please create an issue in the repository.
