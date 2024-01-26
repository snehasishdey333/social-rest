const express=require("express")
const { createNewConversationController,getConversationOfUserController,
    getTwoUsersConversationController,deleteConversationController } = require("../controllers/conversationController")
const router=express.Router()

//NEW CONVERSATION
router.post("/create",createNewConversationController)

//GET CONVERSATIONS OF USER
router.get("/:userId",getConversationOfUserController)

//FIND TWO USERS CONVERSATION
router.get("/:firstUserId/:secondUserId",getTwoUsersConversationController)

//DELETE CONVERSATION
router.delete("/delete/:conversationId",deleteConversationController)


module.exports=router