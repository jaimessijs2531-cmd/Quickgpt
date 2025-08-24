import express from "express"
import { protect } from "../middlewares/auth.js";
import { getPublishedImages, getUser, loginUser, registerUser } from "../controllers/userController.js";

const userRouters = express.Router();

userRouters.post('/register',registerUser)
userRouters.post('/login',loginUser)
userRouters.get('/data',protect,getUser)
userRouters.get('/published-images',getPublishedImages)

export default userRouters;