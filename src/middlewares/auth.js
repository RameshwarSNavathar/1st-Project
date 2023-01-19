const jwt = require("jsonwebtoken");
const bookModel = require("../models/bookModel");
const { isValidObjectId } = require("../validator/validator");

//     Authentication

exports.authenticate = function (req, res, next) {
try{
  let token = req.headers["x-api-key"] 
  if(!token) return res.status(400).send({ status: false, message: "token must be present" });

  jwt.verify(token,"Book-mgmt",{ ignoreExpiration: true },
  function (err, decodedToken){
  if (err){
  return res.status(401).send({ status: false, message: err.message })
  }
  if (Date.now() > decodedToken.exp * 1000) {
  return res.status(400).send({ status: false, message: "token expired" })}

  req.tokenId = decodedToken.userId;
  next();
  })
  } 
catch(error){
  res.status(500).send({ status: false, message: error.message });
  }}


//      Authorisation

exports.authorisation = async function (req, res, next) {
  let bookId = req.params.bookId;

  if(!bookId)
  return res.status(400).send({ status: false, message: "please provide the bookId" });
  if(!isValidObjectId(bookId))
  return res.status(400).send({ status: false, message: "please provide the valid bookId" });
  let book = await bookModel.findById(bookId);
  if(!book)
  return res.status(404).send({ status: false, message: "book not found" });

  if(book.userId != req.tokenId)return res.status(400).send({ status: false, message: "unauthorised user!" });
  next();
  }
