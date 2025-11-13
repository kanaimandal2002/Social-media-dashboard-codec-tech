"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null)
  const { user } = useContext(AuthContext)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/analytics/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAnalytics(response.data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  if (!analytics) return <div className="loading">Loading analytics...</div>

  const chartData = {
    labels: ["Posts", "Likes", "Comments"],
    datasets: [
      {
        data: [analytics.totalPosts, analytics.totalLikes, analytics.totalComments],
        backgroundColor: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
        borderColor: ["#FF5252", "#00BCD4", "#0288D1"],
        borderWidth: 2,
      },
    ],
  }

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        <h2>Your Analytics Dashboard</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Posts</h3>
            <p className="stat-value">{analytics.totalPosts}</p>
          </div>
          <div className="stat-card">
            <h3>Total Likes</h3>
            <p className="stat-value">{analytics.totalLikes}</p>
          </div>
          <div className="stat-card">
            <h3>Total Comments</h3>
            <p className="stat-value">{analytics.totalComments}</p>
          </div>
          <div className="stat-card">
            <h3>Followers</h3>
            <p className="stat-value">{analytics.followers}</p>
          </div>
          <div className="stat-card">
            <h3>Following</h3>
            <p className="stat-value">{analytics.following}</p>
          </div>
        </div>
        <div className="chart-container">
          <Pie data={chartData} />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
