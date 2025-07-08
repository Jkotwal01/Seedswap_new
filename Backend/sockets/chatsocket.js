const Message = require("../models/Message");
const jwt = require("jsonwebtoken");

/**
 * chatSocket(io) – attaches all listeners
 */
module.exports = (io) => {
  io.use((socket, next) => {
    // JWT auth for Socket.io handshake
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token"));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (e) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ Socket connected:", socket.userId);

    // Join all rooms equal to swap IDs the user is involved in
    socket.on("join-swaps", (swapIds) => {
      swapIds.forEach((id) => socket.join(id));
    });

    // Send message
    socket.on("send-msg", async ({ swapId, text }) => {
      const msg = await Message.create({
        swapId,
        sender: socket.userId,
        text,
      });

      // Emit to everyone in that room
      io.to(swapId).emit("new-msg", {
        _id: msg._id,
        swapId,
        sender: socket.userId,
        text,
        createdAt: msg.createdAt,
      });
    });

    socket.on("disconnect", () =>
      console.log("❌ Socket disconnected:", socket.userId)
    );
  });
};
