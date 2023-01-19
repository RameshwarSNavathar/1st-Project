const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

bookId:{
    type: ObjectId,required: true,ref: "books"},

reviewedBy:{
    type: String, required:true,default: "Guest"}, 

reviewedAt:{
    type: Date, required: true},

rating:{
    type: Number,minLength: 1,maxLength: 5,required: true,trim:true},

review:{
    type: String},

isDeleted:{
    type: Boolean,default: false}

},{ timestamps: true })


module.exports = mongoose.model('review', reviewSchema)