const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  bio: String,
  profilePicture: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  coverPhoto: String,
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  totalPosts: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", userSchema)
