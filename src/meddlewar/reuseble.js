const jwt=require("jsonwebtoken");
const userModel = require("../model/userModel");
const {isValidObjectId}=require("mongoose")


//                     o============o  authentication  o============o

const authentication=function(req,res,next){
try{  
  let token =req.headers.token
  if(!token) return res.status(400).send({status:false,message:"Please first is a Login...(token is mandatory)!"})

  let decoded =jwt.verify(token,"my Aadhar Project")
  req.id=decoded.userId  
  next()
  }
catch(err){
  return res.status(500).send({status:false,message:err.message})
  }} 


//                     o============o  Authrisation  o============o

const Authrisation = async function(req,res,next){
  try {
      let {docId}=req.params
      if(!(docId.length==24)) return res.status(400).send({msg:"Put a Right _id in Param (length is 24)!"})

      let Uid=await userModel.findOne({_id:docId})
      if(!Uid) return res.status(404).send({Msg:"This user is not exist,Plese provide Login User Id! <> First is a Login <>"})

      if(req.id!=docId) return res.status(303).send({Msg:"You are not Authorise person.Please Provide valied Login id (tocken),And try again!!"})
      next()   
      }     
catch (error) {
      return res.status(500).send(error)
    }}


 //                                * exports *

module.exports={authentication,Authrisation}