const userModel = require("../model/userModel");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const emailregex =/^\S+@\S+\.\S+$/


//                     o============o  RegisterUser  o============o

const RegisterUser = async function (req, res) {
  try{
  let data = req.body;
  let {Email,Password,ConfirmPassword,firstName,lastName}=data

  if(Object.keys(data).length==0)
  return res.status(400).send({msg:"empty format is not required !"})

  let body=Object.keys(data)
  let isMandatory=["Email","Password","ConfirmPassword","firstName","lastName"]

  for (let i = 0; i < isMandatory.length; i++) {
  const element = isMandatory[i];
  if(!body.includes(element)) {return res.status(400).send({status:false,message:`${element} is a mandatory`})}
}
  if(!emailregex.test(Email)) return res.status(400).send({status:false,Msg:"Please provide a valied format email address"})
  if(!(Password==ConfirmPassword)) return res.status(400).send("please check Confirm the password")

  let hashpass=await bcrypt.hash(Password,10)
  req.body.Password= hashpass 

  req.body.ConfirmPassword= hashpass 
  let unique=await userModel.findOne({Email:Email,firstName:firstName,lastName:lastName})
  if(unique) return res.status(400).send({massge:"This user allready registred!"})

  let uni=await userModel.findOne({Email:Email})
  if(uni) return res.status(400).send({massge:"Email is allready registred!"})

  let save = await userModel.create(data)       
  return res.status(201).send({Result:true,massage:"register sucssesfully",data:save});
  }
catch(err){
  return res.status(500).send({status:false,msg:err.message})  
  }}

//                     o============o  LoginUser  o============o

const loginUser = async function(req,res){
try{  
    let data=req.body
    let {Email,Password}=data

    if(Object.keys(data).length==0)
    return res.status(400).send({msg:"empty format is not required !"})

    if(!Email) return res.status(400).send({status:false,Msg:"Email is Required"})
    if(!Password) return res.status(400).send({status:false,Msg:"Password is Required"})

    if(!emailregex.test(Email)) return res.status(400).send({status:false,Msg:"Please provide a valied format email address"})

    let match=await userModel.findOne({Email:Email})
    if(!match)  return res.status(400).send({msg:"incorect Email,Please Provide a valied Email"})

    let pass=await bcrypt.compare(Password,match.Password)
    if(!pass) return res.status(301).send({msg:"incorect Password,Please Provide a valied Password"})
    
    let token=jwt.sign({userId:match._id},"my Aadhar Project")
    return res.status(201).send({Msg:"Successfully Login" ,token:token})
    }      
    
catch(Error){       
    return res.status(500).send(Error)
  }}  


//                     o============o  Log-OutUser  o============o

const logoutUser=async function(req,res){
  try {
    let token =req.headers.token
    let deley=await userModel.deleteOne(token._id)
    return res.status(200).send({status:true,msg:"Sucessfully Logout !"})
    next()
    } 
  catch (error) {
      return res.status(500).send({status:true,msg:error.message})
      }}
  
  
//                                * exports *

module.exports={loginUser,RegisterUser,logoutUser}