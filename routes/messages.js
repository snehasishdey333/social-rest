const express=require("express")
const { createMessageController,getMessagesController,
    deleteMessageController } = require("../controllers/messageController")
const router=express.Router()

//CREATE MESSAGE
router.post("/create",createMessageController)

//GET MESSAGES
router.get("/:conversationId",getMessagesController)

//DELETE MESSAGE
router.delete("/:messageId",deleteMessageController)

module.exports=router