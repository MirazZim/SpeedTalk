import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"],
    },
  });


  export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }
  

  // used to store online users
// userSocketMap is an object to store the mapping of user id to socket id
// it is used to emit events to a specific user
const userSocketMap = {}; // {userId: socketId}

  

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // get the userId from the query parameter
  const userId = socket.handshake.query.userId;
  // map the userId to the socketId
  if (userId) userSocketMap[userId] = socket.id;

  // emit the event "getOnlineUsers" to all the connected clients
  // with the list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));


// Listen for typing events
socket.on("typing", ({ receiverId, isTyping }) => {
  console.log("Received typing event", { receiverId, isTyping });
  const receiverSocketId = getReceiverSocketId(receiverId);
  if (receiverSocketId) {
    // Emit the typing event to the intended recipient
    io.to(receiverSocketId).emit("typing", { receiverId, isTyping });
  }
});




  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    // remove the userId from the userSocketMap
    delete userSocketMap[userId];
    // emit the event "getOnlineUsers" to all the connected clients
    // with the list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


export {server,io, app};

