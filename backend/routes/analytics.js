const express = require("express")
const Post = require("../models/Post")
const User = require("../models/User")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
    const posts = await Post.find({ author: req.userId })

    let totalLikes = 0
    let totalComments = 0

    posts.forEach((post) => {
      totalLikes += post.likes.length
      totalComments += post.comments.length
    })

    res.json({
      totalPosts: posts.length,
      totalLikes,
      totalComments,
      followers: user.followers.length,
      following: user.following.length,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
