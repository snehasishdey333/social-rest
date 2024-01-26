const { CustomError } = require("../middlewares/error")
const User=require("../models/User")
const Post=require("../models/Post")
const Comment=require("../models/Comment")
const Story=require("../models/Story")

const getUserController=async(req,res,next)=>{
    const {userId}=req.params
    try{
        const user=await User.findById(userId)
        if(!user){
            throw new CustomError("No user found",404)
        }

        const {password,...data}=user
        res.status(200).json(data._doc)

    }
    catch(error){
        next(error)
    }

}

const updateUserController=async (req,res,next)=>{

    const {userId}=req.params
    const updateData=req.body
    try{

        const userToUpdate=await User.findById(userId)
        if(!userToUpdate){
            throw new CustomError("User not found!",404)
        }

        Object.assign(userToUpdate,updateData)

        await userToUpdate.save()

        res.status(200).json({message:"User updated successfully!",user:userToUpdate})

    }
    catch(error){
        next(error)
    }
}

const followUserController=async(req,res,next)=>{

    const {userId}=req.params
    const {_id}=req.body

    try{
        if(userId===_id){
            throw new CustomError("You can not follow yourself",500)
        }

        const userToFollow=await User.findById(userId)
        const loggedInUser=await User.findById(_id)


        if(!userToFollow || !loggedInUser){
            throw new CustomError("User not found!",404)
        }

        if(loggedInUser.following.includes(userId)){
            throw new CustomError("Already following this user!",400)
        }

        loggedInUser.following.push(userId)
        userToFollow.followers.push(_id)

        await loggedInUser.save()
        await userToFollow.save()

        res.status(200).json({message:"Successfully followed user!"})

    }
    catch(error){
        next(error)
    }
}

const unfollowUserController=async(req,res,next)=>{
    const {userId}=req.params
    const {_id}=req.body

    try{
        if(userId===_id){
            throw new CustomError("You can not unfollow yourself",500)
        }

        const userToUnfollow=await User.findById(userId)
        const loggedInUser=await User.findById(_id)

      

        if(!userToUnfollow || !loggedInUser){
            throw new CustomError("User not found!",404)
        }

        if(!loggedInUser.following.includes(userId)){
            throw new CustomError("Not following this user",400)
        }

        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId)
        userToUnfollow.followers=userToUnfollow.followers.filter(id=>id.toString()!==_id)

        await loggedInUser.save()
        await userToUnfollow.save()

        res.status(200).json({message:"Successfully unfollowed user!"})

    }
    catch(error){
        next(error)
    }
}

const blockUserController=async (req,res,next)=>{
    const {userId}=req.params
    const {_id}=req.body
    try{
        if(userId===_id){
            throw new CustomError("You can not block yourself",500)
        }

        const userToBlock=await User.findById(userId)
        const loggedInUser=await User.findById(_id)

        if(!userToBlock || !loggedInUser){
            throw new CustomError("User not found!",404)
        }

        if(loggedInUser.blockList.includes(userId)){
            throw new CustomError("This user is already blocked!",400)
        }

        loggedInUser.blockList.push(userId)

        loggedInUser.following=loggedInUser.following.filter(id=>id.toString()!==userId)
        userToBlock.followers=userToBlock.followers.filter(id=>id.toString()!==_id)

        await loggedInUser.save()
        await userToBlock.save()

        res.status(200).json({message:"Successfully blocked user!"})

    }
    catch(error){
        next(error)
    }
}

const unblockUserController=async(req,res,next)=>{
    const {userId}=req.params
    const {_id}=req.body
    try{
        if(userId===_id){
            throw new CustomError("You can not unblock yourself",500)
        }

        const userToUnblock=await User.findById(userId)
        const loggedInUser=await User.findById(_id)

        if(!userToUnblock || !loggedInUser){
            throw new CustomError("User not found!",404)
        }

        if(!loggedInUser.blockList.includes(userId)){
            throw new CustomError("Not blocking is user!",400)
        }

        loggedInUser.blockList=loggedInUser.blockList.filter(id=>id.toString()!=userId)

        await loggedInUser.save()
        
        res.status(200).json({message:"Successfully unblocked user!"})

    }
    catch(error){
        next(error)
    }
}

const getBlockedUsersController=async(req,res,next)=>{
    const {userId}=req.params
    try{
        const user=await User.findById(userId).populate("blockList","username fullName profilePicture")
        if(!user){
            throw new CustomError("User not found!",404)
        }

        const {blockList,...data}=user

        res.status(200).json(blockList)

    }
    catch(error){
        next(error)
    }
}


const deleteUserController=async(req,res,next)=>{
    const {userId}=req.params

    try{

        const userToDelete=await User.findById(userId)

        if(!userToDelete){
            throw new CustomError("User not found!",404)
        }

        await Post.deleteMany({user:userId})
        await Post.deleteMany({"comments.user":userId})
        await Post.deleteMany({"comments.replies.user":userId})
        await Comment.deleteMany({user:userId})
        await Story.deleteMany({user:userId})
        await Post.updateMany({likes:userId},{$pull:{likes:userId}})
        await User.updateMany(
            {_id:{$in:userToDelete.following}},
            {$pull:{followers:userId}})
        await Comment.updateMany({},{$pull:{likes:userId}})
        await Comment.updateMany({"replies.likes":userId},{$pull:{"replies.likes":userId}})
        await Post.updateMany({},{$pull:{likes:userId}})

        const replyComments=await Comment.find({"replies.user":userId})

        await Promise.all(
            replyComments.map(async(comment)=>{
                comment.replies=comment.replies.filter((reply)=>reply.user.toString()!=userId)
                await Comment.save()
            })
        )

        await userToDelete.deleteOne()
        res.status(200).json({message:"Everything associated with user is deleted successfully!"})

    }
    catch(error){
        next(error)
    }
}

const searchUserController=async (req,res,next)=>{
    const {query}=req.params
    try{

        const users=await User.find({
            $or:[
                {username:{$regex:new RegExp(query,'i')}},
                {fullName:{$regex:new RegExp(query,'i')}}
            ]
        })

        res.status(200).json({users})
    }
    catch(error){
        next(error)
    }

}

const generateFileUrl=(filename)=>{
    return process.env.URL+`/uploads/${filename}`
}

const uploadProfilePictureController=async(req,res,next)=>{
    const {userId}=req.params
    const {filename}=req.file
    try{
        const user=await User.findByIdAndUpdate(userId,{profilePicture:generateFileUrl(filename)},{new:true})
        if(!user){
            throw new CustomError("User not found!",404)
        }

        res.status(200).json({message:"Profile picture updated successfully!",user})

    }
    catch(error){
        next(error)
    }
}

const uploadCoverPictureController=async(req,res,next)=>{
    const {userId}=req.params
    const {filename}=req.file
    try{
        const user=await User.findByIdAndUpdate(userId,{coverPicture:generateFileUrl(filename)},{new:true})
        if(!user){
            throw new CustomError("User not found!",404)
        }

        res.status(200).json({message:"Cover picture updated successfully!",user})

    }
    catch(error){
        next(error)
    }
}


module.exports={getUserController,updateUserController,
    followUserController,unfollowUserController,
    blockUserController,unblockUserController,
    getBlockedUsersController,deleteUserController,
    searchUserController,uploadProfilePictureController,
    uploadCoverPictureController}