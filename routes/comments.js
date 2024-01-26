const express=require("express")
const { createCommentController,createCommentReplyController,
    updateCommentController,updateReplyCommentController,
    getCommentsByPostController,deleteCommentController,
    deleteReplyCommentController,likeCommentController,
    dislikeCommentController,likeReplyCommentController,
    dislikeReplyCommentController } = require("../controllers/commentController")
const router=express.Router()

//CREATE COMMENT
router.post("/create",createCommentController)

//CREATE COMMENT REPLY
router.post("/create/reply/:commentId",createCommentReplyController)

//UPDATE COMMENT
router.put("/update/:commentId",updateCommentController)

//UPDATE REPLY COMMENT
router.put("/update/:commentId/replies/:replyId",updateReplyCommentController)

//GET ALL POST COMMENTS
router.get("/post/:postId",getCommentsByPostController)

//DELETE A COMMENT
router.delete("/delete/:commentId",deleteCommentController)

//DELETE A REPLY COMMENT
router.delete("/delete/:commentId/replies/:replyId",deleteReplyCommentController)

//LIKE A COMMENT
router.post("/like/:commentId/",likeCommentController)

//DISLIKE A COMMENT
router.post("/dislike/:commentId/",dislikeCommentController)

//LIKE A REPLY COMMENT
router.post("/:commentId/replies/like/:replyId",likeReplyCommentController)

//DISLIKE A REPLY COMMENT
router.post("/:commentId/replies/dislike/:replyId",dislikeReplyCommentController)


module.exports=router