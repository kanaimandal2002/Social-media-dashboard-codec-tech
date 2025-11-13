const express = require("express")
const Post = require("../models/Post")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { content, image } = req.body
    const post = new Post({ author: req.userId, content, image })
    await post.save()
    await post.populate("author")
    res.status(201).json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find().populate("author").populate("comments").sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:postId/like", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
    if (post.likes.includes(req.userId)) {
      post.likes.pull(req.userId)
    } else {
      post.likes.push(req.userId)
    }
    await post.save()
    res.json(post)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId)
    res.json({ message: "Post deleted", post })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
