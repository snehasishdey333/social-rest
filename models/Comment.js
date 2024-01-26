const mongoose=require("mongoose")

const commentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
        required:true
    },
    text:{
        type:String,
        required:true,
        trim:true
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    replies:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        text:{
            type:String,
            required:true,
            trim:true
        },
        likes:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }],
        createdAt:{
            type:Date,
            default:Date.now
        }
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Comment=mongoose.model("Comment",commentSchema)

module.exports=Comment