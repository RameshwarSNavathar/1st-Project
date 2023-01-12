const jwt=require("jsonwebtoken");
const userModel = require("../model/userModel");
const {isValidObjectId}=require("mongoose")


//                     o============o  RegisterUser  o============o

const authentication=function(req,res,next){
try{  
  let token =req.headers.token
  if(!token) return res.status(400).send({status:false,message:"token is mandatory!"})

  let decoded =jwt.verify(token,"my Aadhar Project")
  req.id=decoded.userId  
  
  next()
  }
catch(err){
  return res.status(500).send({status:false,message:err.message})
   }} 


//                     o============o  RegisterUser  o============o

const Authrisation = async function(req,res,next){
  try {
      let {docId}=req.params

      let Uid=await userModel.findOne({_id:docId})
      if(!Uid) return res.status(404).send({Msg:"This user is not exist,Plese provide a valied id"})

      if(req.id!=docId) return res.status(303).send({Msg:"you are Not valied user"})
      next()   
      }     
catch (error) {
      return res.status(500).send(error)
    }}


 //                                * exports *

module.exports={authentication,Authrisation}