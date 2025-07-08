const http = require("http");
const app = require("./app"); // your existing Express app
const chatSocket = require("./sockets/chatsocket");

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});

chatSocket(io); // ⬅️ register listeners

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
