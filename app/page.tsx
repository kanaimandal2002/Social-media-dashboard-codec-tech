"use client"

import { useState } from "react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-white">
              SD
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Social Media Dashboard</h1>
              <p className="text-xs text-slate-400">MERN Stack Application</p>
            </div>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/50">
              Full Stack
            </span>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/50">
              Production Ready
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700 overflow-x-auto pb-4">
          {[
            { id: "overview", label: "Overview" },
            { id: "structure", label: "Project Structure" },
            { id: "features", label: "Features" },
            { id: "setup", label: "Quick Setup" },
            { id: "endpoints", label: "API Endpoints" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome to Social Media Dashboard</h2>
                <p className="text-slate-300 leading-relaxed mb-6">
                  A complete, production-ready MERN stack social media platform with real-time messaging, user
                  engagement tracking, and advanced analytics. Built with modern technologies and best practices.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Backend", value: "Node.js + Express" },
                    { label: "Database", value: "MongoDB" },
                    { label: "Frontend", value: "React + Vite" },
                    { label: "Real-time", value: "Socket.IO" },
                  ].map((tech, i) => (
                    <div key={i} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                      <p className="text-slate-400 text-sm mb-1">{tech.label}</p>
                      <p className="text-white font-semibold">{tech.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">What's Included</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Complete backend with 7 API routes
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> React frontend with 5+ components
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Authentication & JWT
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Real-time messaging (Socket.IO)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-blue-400">✓</span> Analytics dashboard with charts
                    </li>
                  </ul>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Ready for Production</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-green-400">✓</span> Error handling & validation
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">✓</span> Responsive design
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">✓</span> Environment configuration
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">✓</span> Complete documentation
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">✓</span> Setup & deployment guides
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Project Structure */}
          {activeTab === "structure" && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Project Structure</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold text-blue-400 mb-4">Backend</h3>
                  <pre className="text-sm text-slate-300 bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                    {`backend/
├── models/
│   ├── User.js
│   ├── Post.js
│   ├── Comment.js
│   ├── Message.js
│   └── Notification.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   ├── comments.js
│   ├── messages.js
│   ├── follows.js
│   └── analytics.js
├── middleware/
│   └── auth.js
├── utils/
│   └── redisClient.js
├── server.js
└── package.json`}
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-cyan-400 mb-4">Frontend</h3>
                  <pre className="text-sm text-slate-300 bg-slate-900/50 rounded-lg p-4 overflow-x-auto">
                    {`frontend/src/
├── components/
│   ├── Auth/
│   ├── Home/
│   ├── Profile/
│   ├── Messages/
│   ├── Analytics/
│   └── Common/
├── pages/
│   ├── HomePage.jsx
│   ├── ProfilePage.jsx
│   ├── MessagesPage.jsx
│   └── AnalyticsPage.jsx
├── context/
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
├── App.jsx
└── index.css`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          {activeTab === "features" && (
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "User Authentication",
                  desc: "Secure JWT-based authentication with hashed passwords",
                  icon: "🔐",
                },
                {
                  title: "Real-time Messaging",
                  desc: "WebSocket-powered instant messaging with Socket.IO",
                  icon: "💬",
                },
                {
                  title: "Post Engagement",
                  desc: "Like, comment, and share posts with real-time updates",
                  icon: "❤️",
                },
                {
                  title: "Follow System",
                  desc: "Follow/unfollow users and build your network",
                  icon: "👥",
                },
                {
                  title: "User Profiles",
                  desc: "Customizable profiles with bio, pictures, and statistics",
                  icon: "👤",
                },
                {
                  title: "Analytics Dashboard",
                  desc: "Track engagement with interactive charts and graphs",
                  icon: "📊",
                },
                {
                  title: "Notifications",
                  desc: "Redis-based notification system for all activities",
                  icon: "🔔",
                },
                {
                  title: "Responsive Design",
                  desc: "Works perfectly on desktop, tablet, and mobile",
                  icon: "📱",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-gradient-to-br from-slate-800 to-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
                >
                  <div className="text-3xl mb-3">{feature.icon}</div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* Quick Setup */}
          {activeTab === "setup" && (
            <div className="space-y-6">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 text-amber-200">
                <p className="font-semibold mb-2">Note:</p>
                <p>
                  This is a full-stack MERN application. The preview above shows the documentation. To run the complete
                  application, download the ZIP file and follow the setup steps below.
                </p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Setup Steps</h2>

                {[
                  {
                    step: 1,
                    title: "Extract Project",
                    code: "unzip social-media-dashboard.zip\ncd social-media-dashboard",
                  },
                  {
                    step: 2,
                    title: "Install Backend Dependencies",
                    code: "cd backend\nnpm install",
                  },
                  {
                    step: 3,
                    title: "Install Frontend Dependencies",
                    code: "cd ../frontend\nnpm install",
                  },
                  {
                    step: 4,
                    title: "Start Services",
                    code: "Terminal 1: mongod\nTerminal 2: redis-server\nTerminal 3: cd backend && npm run dev\nTerminal 4: cd frontend && npm run dev",
                  },
                ].map((item) => (
                  <div key={item.step} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                        {item.step}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-white mb-3">{item.title}</h3>
                        <pre className="bg-slate-900/50 rounded-lg p-4 text-sm text-slate-300 overflow-x-auto">
                          {item.code}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-green-200">
                  <p className="font-semibold mb-2">Access Application:</p>
                  <p className="font-mono">http://localhost:5173</p>
                </div>
              </div>
            </div>
          )}

          {/* API Endpoints */}
          {activeTab === "endpoints" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-6">API Endpoints</h2>

              {[
                { method: "POST", path: "/auth/register", desc: "Register new user" },
                { method: "POST", path: "/auth/login", desc: "Login user" },
                { method: "GET", path: "/users/profile/:userId", desc: "Get user profile" },
                { method: "PUT", path: "/users/profile", desc: "Update profile" },
                { method: "POST", path: "/posts/create", desc: "Create post" },
                { method: "GET", path: "/posts/feed", desc: "Get feed" },
                { method: "POST", path: "/posts/:postId/like", desc: "Like post" },
                { method: "POST", path: "/comments/:postId", desc: "Add comment" },
                { method: "POST", path: "/messages/send", desc: "Send message" },
                { method: "GET", path: "/messages/conversation/:userId", desc: "Get conversation" },
                { method: "POST", path: "/follows/:userId/follow", desc: "Follow user" },
                { method: "GET", path: "/analytics/dashboard", desc: "Get analytics" },
              ].map((endpoint, i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded font-semibold text-white text-sm ${
                      endpoint.method === "POST"
                        ? "bg-green-600"
                        : endpoint.method === "PUT"
                          ? "bg-blue-600"
                          : "bg-cyan-600"
                    }`}
                  >
                    {endpoint.method}
                  </span>
                  <code className="text-slate-300 flex-grow font-mono text-sm">{endpoint.path}</code>
                  <p className="text-slate-400 text-sm">{endpoint.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Download the complete ZIP file and follow the setup guide. Everything you need is included with
            documentation, scripts, and production-ready code.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#"
              className="px-6 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Download ZIP
            </a>
            <a
              href="#"
              className="px-6 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors border border-white/30"
            >
              View Documentation
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white mb-4">About</h3>
              <p className="text-slate-400 text-sm">
                A complete MERN stack social media platform with real-time features and analytics.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Tech Stack</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>MongoDB, Express, React, Node.js</li>
                <li>Socket.IO, Redis, Chart.js</li>
                <li>JWT, Bcrypt, Vite</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-white mb-4">Features</h3>
              <ul className="text-slate-400 text-sm space-y-2">
                <li>Real-time Messaging</li>
                <li>User Engagement Tracking</li>
                <li>Analytics Dashboard</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>Social Media Dashboard - Production Ready MERN Stack Application</p>
            <p className="mt-2">All files, documentation, and setup scripts included</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
