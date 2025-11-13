"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthContext } from "./context/AuthContext"
import { NotificationContext } from "./context/NotificationContext"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import MessagesPage from "./pages/MessagesPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import Navbar from "./components/Common/Navbar"
import { useState, useEffect } from "react"

function App() {
  const [user, setUser] = useState(null)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <NotificationContext.Provider value={{ notifications, setNotifications }}>
        <Router>
          {user && <Navbar />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {user && (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
              </>
            )}
          </Routes>
        </Router>
      </NotificationContext.Provider>
    </AuthContext.Provider>
  )
}

export default App
