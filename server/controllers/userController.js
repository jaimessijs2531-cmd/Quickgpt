import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Chat from "../models/chat.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}


export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email })

        if (userExists) {
            return res.json({ sucess: false, message: "User Already Exists" })
        }
        const user = await User.create({ name, email, password })
        const token = generateToken(user._id)
        res.json({ sucess: true, token })
    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const token = generateToken(user._id);
                return res.json({ sucess: true, token })
            }
        }
        return res.json({ sucess: false, message: "Invalid Email Or Password" })
    } catch (error) {
        return res.json({ sucess: false, message: error.message })
    }
}


export const getUser = async (req, res) => {
    try {
        const user = req.user;
        return res.json({ success: true, user });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getPublishedImages = async (req, res) => {
    try {
        const publishedImageMessages = await Chat.aggregate([
            { $unwind: "$messages" },
            {
                $match: {
                    "message.isImage": true,
                    "message.isPublished": true
                }

            },
            {
                $project:{
                    _id:0,
                    imageUrl:"$messages.content",
                    userName:"$userName"
                }
            }
        ])
         res.json({sucess:true,images:publishedImageMessages.reverse()})
    } catch (error) {
res.json({success:false,message:error.message})
    }
}
