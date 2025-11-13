"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"
import Post from "./Post"

function Feed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState("")
  const { user } = useContext(AuthContext)
  const token = localStorage.getItem("token")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/posts/feed`)
      setPosts(response.data)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching posts:", error)
      setLoading(false)
    }
  }

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) return

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/create`,
        { content: newPostContent, image: "" },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setPosts([response.data, ...posts])
      setNewPostContent("")
    } catch (error) {
      console.error("Error creating post:", error)
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="feed">
      <div className="feed-header">
        <h2>Home Feed</h2>
      </div>
      <div className="create-post">
        <form onSubmit={handleCreatePost}>
          <textarea
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          ></textarea>
          <button type="submit">Post</button>
        </form>
      </div>
      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map((post) => <Post key={post._id} post={post} />)
        ) : (
          <p className="no-posts">No posts yet. Be the first to post!</p>
        )}
      </div>
    </div>
  )
}

export default Feed
