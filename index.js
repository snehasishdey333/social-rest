const express=require("express")
const connectDB = require("./database/db")
const app=express()
const dotenv=require("dotenv")
const cookieParser=require("cookie-parser")
const authRoute=require("./routes/auth")
const userRoute=require("./routes/users")
const postRoute=require("./routes/posts")
const commentRoute=require("./routes/comments")
const storyRoute=require("./routes/stories")
const conversationRoute=require("./routes/conversations")
const messageRoute=require("./routes/messages")
const path=require("path")
const {errorHandler}=require("./middlewares/error")
const verifyToken = require("./middlewares/verifyToken")



dotenv.config()
app.use(express.json())
app.use(cookieParser())
app.use("/uploads",express.static(path.join(__dirname,"uploads")))

app.use("/api/auth",authRoute)
app.use("/api/user",verifyToken,userRoute)
app.use("/api/post",verifyToken,postRoute)
app.use("/api/comment",verifyToken,commentRoute)
app.use("/api/story",verifyToken,storyRoute)
app.use("/api/conversation",verifyToken,conversationRoute)
app.use("/api/message",verifyToken,messageRoute)



app.use(errorHandler)

app.listen(5000,()=>{
    connectDB()
    console.log("app is running")
})