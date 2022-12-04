const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const userModel = require("../models/userModel")
const { isValidObjectId,isValidISBN,isValidString, isValidDate } = require("../validator/validator");

//-------------------------->>-createBook-<<---------------------------<<
const createBook = async function (req, res) {
  try {
      let data = req.body
      const { title, excerpt, userId, ISBN, category, subcategory,releasedAt } = data
      //-------------->>-validation-<<----------------<<
      if(Object.keys(data).length==0) return res.status(400).send({status:false,message:"please provide the data in request"})
      //----------->>-title..
      if (!title) return res.status(400).send({ status: false, message: "title is mandatory in request body" })
      if(!isValidString(title)) return res.status(400).send({status:false,message:"please provide the valid title"})
      let findTitle =await bookModel.findOne({title:title})
      if(findTitle) return res.status(400).send({ status: false, message: "this title is already exists" })

      //----------->>-excerpt..
      if (!excerpt) return res.status(400).send({ status: false, message: "excerpt is mandatory in request body" })
      if(!isValidString(excerpt)) return res.status(400).send({status:false,message:"please provide the valid excerpt"})

      //----------->>-userId..
      if (!userId) return res.status(400).send({ status: false, message: "userId is mandatory in request body" })
      if(!isValidObjectId(userId)) return res.status(400).send({status:false,message:"please provide the valid userId"})
      let user=await userModel.findById(userId)
      if(!user) return res.status(400).send({ status: false, message: "please provide the valid userId" })
      
      //----------->>-ISBN..
      if (!ISBN) return res.status(400).send({ status: false, message: "ISBN is mandatory in request body" })
      if (!isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "please provide the valid ISBN"})
      let findBook = await bookModel.findOne({ISBN:ISBN})
      if (findBook)  return res.status(400).send({ status: false, message: "please provide the unique ISBN"})

      //----------->>-category..
      if (!category) return res.status(400).send({ status: false, message: "category is mandatory in request body" })
      if (!isValidString(category)) return res.status(400).send({ status: false, message: "please provide the valid catagory" })

      //----------->>-subcategory..
      if (!subcategory) return res.status(400).send({ status: false, message: "subcategory is mandatory in request body" })
      if (!isValidString(subcategory)) return res.status(400).send({ status: false, message: "please provide the valid subcategory" })

      //------------>>-releasedAt..
      if (!releasedAt) return res.status(400).send({ status: false, message: "releasedAt is mandatory in request body" })
      if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please provide the valid releasedAt" })

      //------------->>-createBook..
      let createBook = await bookModel.create(data)
      return res.status(201).send({ status: true,message:"book created successfully" ,data: createBook })
  } catch (err) {
      return res.status(500).send({ status: false, message: err.message })
  }
}

//------------------------------->>-getBook-<<-------------------<<
const getbooks = async function (req, res) {
  try {
    let queries = req.query;
      let result = { isDeleted: false, ...queries };
      if (!Object.keys(queries).length) {
        const data = await bookModel.find({ isDeleted: false }).sort({ title: 1 });
        if (data.length == 0) return res.status(404).send({ status: false, message: "Book not found" });

        return res.status(200).send({ status: true, Data: data });
    } 
    else {
      const data = await bookModel.find(result)
        .select({title: 1, _id: 1, excerpt: 1,userId: 1, category: 1, releasedAt: 1,reviews: 1,})
        .sort({ title: 1 });

      if (data.length == 0) return res.status(404).send({ status: false, message: "Book not found" });

      return res.status(200).send({ status: true,message : "Book list", data: data });
    }
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

/***********************************get book by id********************************************/
const getBookById = async function(req,res){
  try {
    let bookId = req.params.bookId
    const bookById = await bookModel.findOne({isDeleted:false , _id : bookId})
    if(!bookById) return res.status(404).send({status:false , message : "Book not found with this bookId"});
    
    let books= bookById.toObject()
    let finalData = await reviewModel.find({bookId:bookId,isDeleted:false}).select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 });
    books.reviewesData = finalData;

    return res.status(200).send({status: true,message: "Books list",data: books})
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });    
  }
}

//************update books********//
const updateBook = async function (req, res) {
  try {
    let data = req.body
    const {title, excerpt, releasedAt, ISBN} = data
    let bookId = req.params.bookId
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide Data in body" })

    let reqData = Object.keys(data)  
    let enums = ["title", "excerpt", "releasedAt", "ISBN"]
    for (let i = 0; i< reqData.length; i++) {
      const element = reqData[i];
      if (!enums.includes(element)) {
        return res.status(400).send({ status: false, message: `book cannot update using ${element} field` })
      }
    }
    
    if (title) {
      if(!isValidString(title)) return res.status(400).send({status:false,message:"please provide the valid title"})
      let findTitle =await bookModel.findOne({title:title})
      if(findTitle) return res.status(400).send({ status: false, message: "this title is already exists" })
    }
    if(excerpt){
      if(!isValidString(excerpt)) return res.status(400).send({status:false,message:"please provide the valid excerpt"})
    }

    if(releasedAt){
      if (!isValidDate(releasedAt)) return res.status(400).send({ status: false, message: "please provide the valid releasedAt" })
    }
    
    if (ISBN){
      if (!isValidISBN(ISBN)) return res.status(400).send({ status: false, message: "please provide the valid ISBN"})
      let findBook = await bookModel.findOne({ISBN:ISBN})
      if (findBook)  return res.status(400).send({ status: false, message: "please provide the unique ISBN"})
    }
    let updatebook = await bookModel.findByIdAndUpdate({ _id: bookId }, data, { new: true })

    return res.status(200).send({ status: true,message :"Book updated", data: updatebook })
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message })
  }
}

/*****************************************delete book by Id**************************************/
const deletebookbyId= async function(req, res){
  try{
    let bookId = req.query.bookId
    const bookbyId= await bookModel.findOneAndUpdate({_id:bookId}, {$set:{isDeleted:true,deletedAt:new Date(Date.now())}}, {new:true})
    if(!bookbyId) return res.status(404).send({status: false,  message: "book not exists with this bookId"})
    return res.status(200).send({status:true, message: "successfully deleted", data: bookbyId })
  }catch(error){
    return res.status(500).send({status:false, message:error.message})
  }
}
module.exports = {getbooks,createBook,getBookById,updateBook,deletebookbyId}