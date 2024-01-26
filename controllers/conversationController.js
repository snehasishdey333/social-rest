const Conversation=require("../models/Conversation")
const Message=require("../models/Message")

const createNewConversationController=async(req,res,next)=>{
    try{
        let newConversation;
        if(req.body.firstUser!==req.body.secondUser){
            newConversation=new Conversation({
                participants:[req.body.firstUser,req.body.secondUser]
            })
        }
        else{
            throw new CustomError("Sender and receiver can not be same!",400)
        }

        const savedConversation=await newConversation.save()
        res.status(201).json(savedConversation)

    }
    catch(error){
       next(error)
    }
}

const getConversationOfUserController=async(req,res,next)=>{
    try{
        const conversations=await Conversation.find({
            participants:{$in:[req.params.userId]},
        })
        res.status(200).json(conversations)

    }
    catch(error){
        next(error)
    }

}

const getTwoUsersConversationController=async(req,res,next)=>{

    try{
        const conversations=await Conversation.find({
            participants:{$all:[req.params.firstUserId,req.params.secondUserId]},
        })
        res.status(200).json(conversations)
    }
    catch(error){
        next(error)
    }
}

const deleteConversationController=async (req,res,next)=>{

    const conversationId=req.params.conversationId
    
    try{
        await Conversation.deleteOne({_id:conversationId})
        await Message.deleteMany({conversationId:conversationId})

        res.status(200).json({message:"Conversationd deleted successfully!"})
    }
    catch(error){
        next(error)
    }
}

module.exports={createNewConversationController,getConversationOfUserController,
    getTwoUsersConversationController,deleteConversationController}