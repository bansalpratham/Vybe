import express from 'express'
import dotenv from 'dotenv'
import cookieParser from "cookie-parser"
import connectDB from './config/db.js'
import cors from 'cors'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import postRouter from './routes/post.routes.js'
import loopRouter from './routes/loop.routes.js'
import storyRouter from './routes/story.routes.js'
import notificationRouter from './routes/notification.routes.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

connectDB()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/post", postRouter)
app.use("/api/loop", loopRouter)
app.use("/api/story", storyRouter)
app.use("/api/notification", notificationRouter)

app.listen(port, () => {
    console.log(`server started`)
})