const express = require("express");
const router = express.Router();
const bookController=require("../controllers/bookController")
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController");
const {authenticate,authorisation} = require("../middlewares/auth");



router.post("/register", userController.createUser);
router.post("/login",userController.userLogin)
router.post("/books",authenticate,bookController.createBook)
router.get("/books",authenticate,bookController.getbooks)
router.get("/books/:bookId",authenticate,authorisation,bookController.getBookById)
router.put("/books/:bookId",authenticate,authorisation,bookController.updateBook)
router.delete("/books/:bookId",authenticate,authorisation,bookController.deletebookbyId)
router.post("/books/:bookId/review",reviewController.createReview)
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)


router.all("/*",function (req,res){
    return res.status(404).send({status:false,message:"path not found"})
})

module.exports = router;