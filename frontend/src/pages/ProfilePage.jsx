"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"

function ProfilePage() {
  const { userId } = useParams()
  const { user } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/profile/${userId}`)
      setProfile(response.data)
      setIsFollowing(response.data.followers.includes(user?._id))
    } catch (error) {
      console.error("Error fetching profile:", error)
    }
  }

  const handleFollow = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/follows/${userId}/follow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setIsFollowing(true)
      fetchProfile()
    } catch (error) {
      console.error("Error following user:", error)
    }
  }

  const handleUnfollow = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/follows/${userId}/unfollow`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setIsFollowing(false)
      fetchProfile()
    } catch (error) {
      console.error("Error unfollowing user:", error)
    }
  }

  if (!profile) return <div className="loading">Loading profile...</div>

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="cover-photo">
            {profile.coverPhoto && <img src={profile.coverPhoto || "/placeholder.svg"} alt="Cover" />}
          </div>
          <div className="profile-info">
            <img
              src={profile.profilePicture || "https://via.placeholder.com/120"}
              alt={profile.username}
              className="profile-pic"
            />
            <div className="profile-details">
              <h2>{profile.username}</h2>
              <p className="bio">{profile.bio}</p>
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-number">{profile.totalPosts}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{profile.followers?.length || 0}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{profile.following?.length || 0}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
              {user?._id !== userId && (
                <button
                  className={`follow-btn ${isFollowing ? "following" : ""}`}
                  onClick={isFollowing ? handleUnfollow : handleFollow}
                >
                  {isFollowing ? "Unfollow" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
