"use client"

import { useState, useContext } from "react"
import { AuthContext } from "../../context/AuthContext"
import axios from "axios"

function Post({ post }) {
  const [likes, setLikes] = useState(post.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const { user } = useContext(AuthContext)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState(post.comments || [])
  const [newComment, setNewComment] = useState("")
  const token = localStorage.getItem("token")

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setIsLiked(!isLiked)
      setLikes(response.data.likes.length)
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${post._id}`,
        { content: newComment },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setComments([...comments, response.data])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  return (
    <div className="post">
      <div className="post-header">
        <img
          src={post.author?.profilePicture || "https://via.placeholder.com/40"}
          alt={post.author?.username}
          className="post-avatar"
        />
        <div className="post-author-info">
          <h4>{post.author?.username}</h4>
          <small>{new Date(post.createdAt).toLocaleDateString()}</small>
        </div>
      </div>
      <div className="post-content">
        <p>{post.content}</p>
        {post.image && <img src={post.image || "/placeholder.svg"} alt="Post" className="post-image" />}
      </div>
      <div className="post-stats">
        <span>{likes} likes</span>
        <span>{comments.length} comments</span>
      </div>
      <div className="post-actions">
        <button onClick={handleLike} className={isLiked ? "liked" : ""}>
          Heart Like
        </button>
        <button onClick={() => setShowComments(!showComments)}>Comment</button>
        <button>Share</button>
      </div>
      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <strong>{comment.author?.username}:</strong> {comment.content}
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Post
