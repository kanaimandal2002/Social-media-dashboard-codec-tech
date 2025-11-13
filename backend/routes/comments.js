const express = require("express")
const Comment = require("../models/Comment")
const Post = require("../models/Post")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body
    const comment = new Comment({
      post: req.params.postId,
      author: req.userId,
      content,
    })
    await comment.save()
    await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: comment._id } })
    res.status(201).json(comment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
