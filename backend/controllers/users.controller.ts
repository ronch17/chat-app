import User from '../models/user.model';
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.error("Error in getUsersForSidebar", error);
        res.status(500).json({error: "Internal server error"});
    }
}

export const getMessage = async (req, res) => {
    try {
        const {id} = req.params;
        const myId = req.user._id;

        const messages = await Message.find(
            {$or: [{senderId: myId, receiverId: id}, {senderId: id, receiverId: myId}]}
        )

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessage", error);
        res.status(500).json({error: "Internal server error"});
    }

}

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            text,
            image: imageUrl,
            senderId,
            receiverId
        })
        await newMessage.save();

        res.status(201).json(newMessage);

    } catch (error) {
        console.error("Error in sendMessage", error);
        res.status(500).json({error: "Internal server error"});
    }
}