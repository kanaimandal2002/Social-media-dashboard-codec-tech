const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const cors = require("cors")
const redisClient = require("./utils/redisClient")

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
})

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: "10mb", extended: true }))

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error:", err))

app.use("/api/auth", require("./routes/auth"))
app.use("/api/users", require("./routes/users"))
app.use("/api/posts", require("./routes/posts"))
app.use("/api/comments", require("./routes/comments"))
app.use("/api/messages", require("./routes/messages"))
app.use("/api/follows", require("./routes/follows"))
app.use("/api/analytics", require("./routes/analytics"))

io.on("connection", (socket) => {
  console.log("New user connected:", socket.id)

  socket.on("join_room", (data) => {
    socket.join(data.room)
    console.log(`${data.userId} joined room ${data.room}`)
  })

  socket.on("send_message", async (data) => {
    socket.to(data.room).emit("receive_message", data)
    await redisClient.lpush(`messages:${data.room}`, JSON.stringify(data))
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = { app, io }
