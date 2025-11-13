const express = require("express")
const Message = require("../models/Message")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

router.post("/send", authMiddleware, async (req, res) => {
  try {
    const { recipientId, content, image } = req.body
    const message = new Message({
      sender: req.userId,
      recipient: recipientId,
      content,
      image,
    })
    await message.save()
    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/conversation/:userId", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.userId, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.userId },
      ],
    }).sort({ createdAt: 1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
