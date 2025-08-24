import Chat from "../models/chat.js"

export const craeteChat = async (req, res) => {
    try {
        const userId = req.user._id

        const chatData = {
            userId,
            messages: [],
            name: "New chat",
            userName: req.user.name
        }
        await Chat.create(chatData)
        res.json({ sucess: true, messages: "Chat Created" })
    } catch (error) {
        res.json({ sucess: false, message: error.message })
    }
}
export const getChats = async (req, res) => {
    try {
        const userId = req.user._id
        const chats = await Chat.find({ userId }).sort({ updatedAt: -1 })
        res.json({ sucess: true, chats })
    } catch (error) {
        res.json({ sucess: false, message: error.message })
    }
}


export const deleteChat = async (req, res) => {
    try {
        const userId = req.user._id
        const{chatId} = req.body;

        await Chat.deleteOne({_id:chatId,userId})
        res.json({sucess:true,message:"Chat Deleted "})
     } catch (error) {
        res.json({ sucess: false, message: error.message })
    }
}

