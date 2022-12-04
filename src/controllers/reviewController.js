const reviewModel = require('../models/reviewModel')
const bookModel = require("../models/bookModel")
const { isValidObjectId,isValidString,isValidRating } = require("../validator/validator");

/*************************************create review***************************************/
const createReview = async function(req,res){
    try{
        const data = req.body
        const {reviewedBy,rating,review} = data
        if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"please provide some data "})

        const bookId = req.params.bookId
        
        if(!bookId) return res.status(400).send({status:false,message:"please provide bookId"})
        if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"please provide valid bookId"})
        
        let findBook=await bookModel.findOne({_id:bookId})
        if(!findBook) return res.status(404).send({ status: false, message: "book not found" })
        if(findBook.isDeleted==true) return res.status(400).send({status:false,message:"book is already deleted"})

        if(!rating) return res.status(400).send({status:false,message:"please provide rating"})
        if(!isValidRating(rating)) return res.status(400).send({status :false , message : "please provide rating in between 1 to 5"})
    
        if(reviewedBy){
            if(!isValidString(reviewedBy)) return res.status(400).send({status:false,message:"please provide a valid reviewedBy"})
        }
        if(review){
            if(!isValidString(review)) return res.status(400).send({status:false,message:"please provide a valid review"})
        }
        data.bookId=bookId
        data.reviewedAt=new Date(Date.now())
        const reviewBook = await reviewModel.create(data)
        if (reviewBook) { 
            var updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },
                 { $inc: { reviews: 1 }}, { new: true }).select({ __v: 0 }).lean()
            }
            let finalData = await reviewModel.find(reviewBook).select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 });
        updateData.reviewsData = finalData
        return res.status(201).send({status:true,message:"review created successfully",data:updateData})}
    catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}

/**********************************************Update Review *******************************/

const updateReview = async function(req,res){
    try {
        let data = req.body
        const {review, rating, reviewedBy} = data
        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide Data" })
        const bookId = req.params.bookId
        const reviewId = req.params.reviewId

        if (!bookId) return res.status(400).send({ status: false, message: "please provide bookId" })
        if(!isValidObjectId(bookId)) return res.status(400).send({status : false , message : "please provide valid bookId"})
        
        const findBook = await bookModel.findById(bookId)
        if (!findBook) return res.status(404).send({ status: false, message: "book not found" })
        if (findBook.isDeleted == true) return res.status(400).send({ status: false, message: "book is already deleted" })

        if (!reviewId) return res.status(400).send({ status: false, message: "please provide reviewId" })
        if(!isValidObjectId(reviewId)) return res.status(400).send({status : false , message : "please provide valid reviewId"})

        const findReview = await reviewModel.findById(reviewId)
        if (!findReview) return res.status(404).send({ status: false, message: "review not found" })
        if (findReview.isDeleted == true) return res.status(400).send({ status: false, message: "review is already deleted" })
        
        if(review){
            if(!isValidString(review)) return res.status(400).send({status :false , message : "please provide valid review"})
        }

        if(rating){
            if(!isValidRating(rating)) return res.status(400).send({status :false , message : "please provide rating in between 1 to 5"})
        }
        let reviewBook = await reviewModel.findOneAndUpdate({ _id:reviewId ,bookId : bookId },data, { new: true })
        if (reviewBook) { 
            var updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },{ new: true }).select({ __v: 0 }).lean()
            let finalData = await reviewModel.find(reviewBook).select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 });
            updateData.reviewsData = finalData
            return res.status(200).send({status:true,message:"successfully update",data:updateData});
            }

        }catch (error) {
        return res.status(500).send({status : false , message : error.message})
    }
}


const deleteReview =async function(req,res){
    try {
        const{bookId,reviewId}=req.params
    if(!bookId) return res.status(400).send({status:false,message:"please provide the bookId"})
    if(!isValidObjectId(bookId)) return res.status(400).send({status:false,message:"please provide the valid bookId"})
    
    let book=await bookModel.findOne({_id:bookId,isDeleted:false})
    if(!book) return res.status(404).send({status:false,message:"this book is not exists"})
    
    if(!reviewId) return res.status(400).send({status:false,message:"please provide the reviewId"})
    if(!isValidObjectId(reviewId)) return res.status(400).send({status:false,message:"this reviewId is not exists"})
    
    let review=await reviewModel.findOne({_id:reviewId,isDeleted:false})
    if(!review) return res.status(404).send({status:false,message:"this review is not exists"})

    const reviewBook = await reviewModel.findOneAndUpdate({_id:reviewId, bookId: bookId}, {$set:{isDeleted:true,deletedAt:new Date(Date.now())}}, {new:true})
    if(!reviewBook) return res.status(400).send({status: false,  message: "review not exists with this reviewId"})
    
    if (reviewBook) { 
        var updateData = await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false },
             { $inc: { reviews: -1 }}, { new: true }).select({ __v: 0 }).lean()
        let finalData = await reviewModel.find(reviewBook).select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 });
        updateData.reviewsData = finalData
        return res.status(200).send({status:true,message:"successfully deleted",data:updateData});
    }
        
    } catch (error) {
        return res.status(500).send({status : false , message : error.message})
    }
}
module.exports={createReview,updateReview,deleteReview}
