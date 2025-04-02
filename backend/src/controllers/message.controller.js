import cloudinary from "../lib/cloudinary";
import Message from "../models/message.model";
import User from "../models/user.model";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedUserId } }).select("-password");

        if (!filteredUsers) {
            return res.status(404).json({ message: "No users found" });
        }
        return res.status(200).json(filteredUsers);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

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
        return res.status(500).json({ message: "Internal server error" });
    }
};

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

        return res.status(201).json(newMessage);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};

export default {
    getUsersForSidebar,
    getMessages,
    sendMessage
};