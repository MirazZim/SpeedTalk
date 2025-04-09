import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Existing method to get users for the sidebar
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");

        if (!filteredUsers) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUsersForSidebar: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Existing method to get messages
export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        return res.status(200).json(messages);


    } catch (error) {
        console.log("Error in getMessages: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Existing method to send a message
export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            //Upload image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //todo: real time functionality goes here
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        return res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// New method to add or update a message reaction
export const addReaction = async (req, res) => {
    try {
        const { messageId, emoji } = req.body;  // Reaction data: messageId, emoji
        const userId = req.user._id;

        // Find the message by its ID
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        // Check if the user has already reacted to this message with the same emoji
        const existingReactionIndex = message.reactions.findIndex(
            (r) => r.userId.toString() === userId.toString()
        );

        if (existingReactionIndex !== -1) {
            // Update the existing reaction with the new emoji
            message.reactions[existingReactionIndex].emoji = emoji;
        } else {
            // Add a new reaction to the message
            message.reactions.push({ userId, emoji });
        }

        // Save the updated message with reactions
        await message.save();

        // Emit the updated message with reactions to all clients in the conversation
        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);

        // Notify both the sender and receiver about the new reaction
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("new-reaction", message);
        }

        if (senderSocketId && senderSocketId !== receiverSocketId) {
            io.to(senderSocketId).emit("new-reaction", message);
        }

        return res.status(200).json(message);
    } catch (error) {
        console.log("Error in addReaction: ", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    getUsersForSidebar,
    getMessages,
    sendMessage,
    addReaction
};