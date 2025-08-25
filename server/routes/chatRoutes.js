import express from "express"
import { protect } from "../middlewares/auth.js";
import { craeteChat, deleteChat, getChats } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get('/create',protect,craeteChat)
chatRouter.get('/get',protect,getChats)
chatRouter.post('/delete',protect,deleteChat)

export default chatRouter;