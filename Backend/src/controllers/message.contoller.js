import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
export const getUsersForSidebar = async (req, res) => {
    try {
        const loginUserId = req.user._id;
        const filterdUser = await User.find({ _id: { $ne: loginUserId } }).select("-password");
        res.status(200).json(filterdUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
        
    }
};

export const getMessages = async (req, res) => {
    try {
        const {id:userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderId:myId,reciverId:userToChatId},
                {senderId:userToChatId,reciverId:myId}
            ]
        })
        res.status(200).json(messages);

        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
        
    }
};

export const sendMessage = async (req, res) => {
    try {
        const {text,image} = req.body;
        const {id:reciverId} = req.params;
        // console.log("reciverId",reciverId);
        const senderId = (req.user._id).toJSON();
        // console.log("senderId",senderId);

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId:senderId,
            reciverId:reciverId,
            text:text,
            image:imageUrl
        });
        await newMessage.save();
        //realtime functionality here
        res.status(200).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
        
    }
};