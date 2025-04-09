import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";


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






socket.on("send-reaction", async ({ messageId, reaction }) => {
  try {
    console.log("Received reaction:", { messageId, reaction });

    // Find the message by its ID
    const message = await Message.findById(messageId);
    if (!message) {
      console.log("Message not found");
      return;
    }

    // Check if the user has already reacted with this emoji
    const existingReactionIndex = message.reactions.findIndex(
      (r) => r.userId.toString() === reaction.userId.toString()
    );

    if (existingReactionIndex !== -1) {
      console.log("Updating existing reaction...");
      // Update the existing reaction with the new emoji
      message.reactions[existingReactionIndex].emoji = reaction.emoji;
    } else {
      console.log("Adding new reaction...");
      // Add new reaction
      message.reactions.push(reaction);
    }

    // Save the updated message with reactions
    await message.save();

    // Emit the updated message with reactions to all clients
    console.log("Emitting new-reaction with updated message:", message);
    io.emit("new-reaction", { _id: message._id, reactions: message.reactions });

  } catch (error) {
    console.error("Error handling reaction:", error);
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

