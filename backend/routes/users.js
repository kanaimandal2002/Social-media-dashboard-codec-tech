const express = require("express")
const User = require("../models/User")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

router.get("/profile/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("followers following")
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, bio, profilePicture } = req.body
    const user = await User.findByIdAndUpdate(req.userId, { firstName, lastName, bio, profilePicture }, { new: true })
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get("/search", async (req, res) => {
  try {
    const { q } = req.query
    const users = await User.find({
      $or: [{ username: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }],
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
