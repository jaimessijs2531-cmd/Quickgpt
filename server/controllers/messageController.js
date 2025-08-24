import axios from "axios"
import Chat from "../models/chat.js"
import User from "../models/User.js"
import imagekit from "../configs/imageKit.js"
import openai from "../configs/openAi.js"


export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id
         if (req.user.credits < 1) {
            return res.json({ sucess: false, message: "You don't have enough credits to use this feauture " })
        }

        const { chatId, prompt } = req.body

        const chat = await Chat.findOne({ userId, _id: chatId })
        chat.messages.push({ role: 'user', content: prompt, timestamp: Date.now(), isImage: false })

        const { choices } = await openai.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });
        const replay = { ...choices[0].message, timestamp: Date.now(), isImage: false }
        res.json({ sucess: true, replay })
        chat.push(replay)
        await chat.save()
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })
    } catch (error) {
        res.json({ sucess: false, message: error.message })
    }
}


export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id

        if (req.user.credits < 2) {
            return res.json({ sucess: false, message: "You don't have enough credits to use this feauture " })
        }

        const { prompt, chatId, isPublished } = req.body;

        const chat = await Chat.findOne({ userId, _id: chatId })
        chat.messages.push({ role: 'user', content: prompt, timestamp: Date.now(), isImage: false });
        const encodedPrompt = encodeURIComponent(prompt);
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/quickgpt${Date.now()}.png?tr=w-800,h-800`;
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" })

        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`;

        const uploadResponse = await imagekit.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "Quickgpt"
        })
        const replay = { role: "assistant", content: uploadResponse.url, timestamp: Date.now(), isImage: true, isPublished }
        res.json({ sucess: true, replay })
        chat.messages.push(replay)
        await chat.save();
await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })

    } catch (error) {
res.json({sucess:false,message:error.message})
    }
}