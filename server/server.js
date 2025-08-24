import express from "express"
import 'dotenv/config'
import cors from "cors"
import connectDb from "./configs/db.js"
import userRouters from "./routes/userRoutes.js"
import chatRouter from "./routes/chatRoutes.js"
import messageRouter from "./routes/messageRoutes.js"
import creditRouter from "./routes/creditsRoutes.js"
import { stripWebHooks } from "./controllers/webHooks.js"

const app =express()

await connectDb()

app.post('/api/stripe',express.raw({type:'application/json'}),stripWebHooks)

//middlware
app.use(cors())
app.use(express.json())

//Routes
app.get('/',(re,res)=>res.send('Server Is Live!'))
app.use('/api/user',userRouters)
app.use('/api/chat',chatRouter)
app.use('/api/message',messageRouter)
app.use('/api/credit',creditRouter)

const PORT = process.env.PORT ||3000

app.listen(PORT,()=>[
    console.log(`Server Is Running On Port ${PORT}`)
])
