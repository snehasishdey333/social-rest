const express=require("express")
const { createStoryController,getStoriesController, 
    getUserStoriesController,deleteStoryController,
    deleteStoriesController } = require("../controllers/storyController")
const upload = require("../middlewares/upload")
const router=express.Router()

//CREATE STORY
router.post("/create/:userId",upload.single("image"),createStoryController)

//GET ALL STORIES
router.get("/all/:userId",getStoriesController)

//GET USER STORIES
router.get("/user/:userId",getUserStoriesController)

//DELETE A STORY
router.delete("/delete/:storyId",deleteStoryController)

//DELETE ALL STORIES
router.delete("/delete/stories/:userId",deleteStoriesController)





module.exports=router