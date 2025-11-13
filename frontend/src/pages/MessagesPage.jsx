"use client"

import { useState, useEffect, useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import axios from "axios"
import { io } from "socket.io-client"

function MessagesPage() {
  const [conversations, setConversations] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const { user } = useContext(AuthContext)
  const [socket, setSocket] = useState(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL)
    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  useEffect(() => {
    if (socket && user) {
      socket.emit("join_room", { userId: user._id, room: `user_${user._id}` })
    }
  }, [socket, user])

  const fetchMessages = async (userId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/messages/conversation/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessages(response.data)
      setSelectedUser(userId)
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/messages/send`,
        { recipientId: selectedUser, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setMessages([...messages, response.data])
      setNewMessage("")

      if (socket) {
        socket.emit("send_message", {
          room: `chat_${user._id}_${selectedUser}`,
          message: response.data,
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        <div className="conversations-list">
          <h3>Conversations</h3>
          {conversations.length > 0 ? (
            conversations.map((conv) => (
              <div
                key={conv._id}
                className={`conversation ${selectedUser === conv._id ? "active" : ""}`}
                onClick={() => fetchMessages(conv._id)}
              >
                <img src={conv.profilePicture || "https://via.placeholder.com/40"} alt={conv.username} />
                <div className="conv-info">
                  <p className="conv-name">{conv.username}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-conversations">No conversations yet</p>
          )}
        </div>
        <div className="chat-window">
          {selectedUser ? (
            <>
              <div className="messages-list">
                {messages.map((msg) => (
                  <div key={msg._id} className={`message ${msg.sender === user._id ? "sent" : "received"}`}>
                    <p>{msg.content}</p>
                    <small>{new Date(msg.createdAt).toLocaleTimeString()}</small>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="message-form">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit">Send</button>
              </form>
            </>
          ) : (
            <div className="no-conversation">Select a conversation to start messaging</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessagesPage
