const express = require("express")
const User = require("../models/User")
const authMiddleware = require("../middleware/auth")

const router = express.Router()

router.post("/:userId/follow", authMiddleware, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId)
    const currentUser = await User.findById(req.userId)

    if (!userToFollow.followers.includes(req.userId)) {
      userToFollow.followers.push(req.userId)
      currentUser.following.push(req.params.userId)
    }

    await userToFollow.save()
    await currentUser.save()
    res.json({ message: "Followed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.post("/:userId/unfollow", authMiddleware, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId)
    const currentUser = await User.findById(req.userId)

    userToUnfollow.followers.pull(req.userId)
    currentUser.following.pull(req.params.userId)

    await userToUnfollow.save()
    await currentUser.save()
    res.json({ message: "Unfollowed successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
