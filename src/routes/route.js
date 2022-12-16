const express = require("express");
const router = express.Router();
const bookController=require("../controllers/bookController")
const userController = require("../controllers/userController");
const reviewController = require("../controllers/reviewController");
const {authenticate,authorisation} = require("../middlewares/auth");


/***********************************user register *****************************/
router.post("/register", userController.createUser);

/***********************************login ************************************/
router.post("/login",userController.userLogin)

/***************************************create Book**************************/
router.post("/books",authenticate,bookController.createBook)

/*****************************getbooks***************************************/
router.get("/books",authenticate,bookController.getbooks)

/**************************get Book By BookId *******************************/
router.get("/books/:bookId",authenticate,authorisation,bookController.getBookById)

/*************************update books**************************************/
router.put("/books/:bookId",authenticate,authorisation,bookController.updateBook)

/***********************************delete books****************************/
router.delete("/books/:bookId",authenticate,authorisation,bookController.deletebookbyId)

/***********************************create review***************************/
router.post("/books/:bookId/review",reviewController.createReview)

/***********************************update review***************************/
router.put("/books/:bookId/review/:reviewId",reviewController.updateReview)

/************************************delete review  ***********************/
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteReview)

/***********************************upload file ************************/

router.post("/aws-sdk",bookController.bookCover)

/*******************************path not found  ***********************/
router.all("/*",function (req,res){
    return res.status(404).send({status:false,message:"path not found"})
})

module.exports = router;