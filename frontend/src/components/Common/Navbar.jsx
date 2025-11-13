"use client"

import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"

function Navbar() {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/login")
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="logo">
          SocialHub
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to={`/profile/${user?._id}`}>Profile</Link>
          </li>
          <li>
            <Link to="/messages">Messages</Link>
          </li>
          <li>
            <Link to="/analytics">Analytics</Link>
          </li>
        </ul>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
