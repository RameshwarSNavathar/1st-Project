const adharModel = require("../model/adharModel")
const userModel =require("../model/userModel")
const regexExp = /^[6-9]\d{9}$/   


//                    o============o  createAdhar  o============o

const createAdhar=async function(req,res){
try {
    let data=req.body
    let {docId}=req.params
    let {mobail,AdharNumber,FullName,userId}=data

    if  (Object.keys(data).length==0)
    return res.status(400).send({msg:"empty format is not required !"})

    let body=Object.keys(data)
    let isMandatory=["FullName","DateOfBirth","age","mobail","address","pinCode","AdharNumber","userId"]

    for (let i = 0; i < isMandatory.length; i++) {
        const element = isMandatory[i];
    if  (!body.includes(element)) {return res.status(400).send({status:false,message:`${element} is a mandatory`})}
    }
    if(!regexExp.test(mobail)) return res.status(400).send({status:false,Msg:"Please provide a valied mobail Numbar (10 digit)"})
    if(!(AdharNumber.length==12)) return res.status(400).send({status:false,Msg:"Please provide a valied AdharNumber (12 digit)"})

    let machId=await adharModel.findOne({userId:userId})
    if(machId) return res.status(400).send({Msg:"this user is allready created Aadhar card"})

    let unique=await adharModel.findOne({mobail:mobail})
    if(unique) return res.status(400).send({Result:false,Massage:"mobail Numbar is allredy registred"})

    let AdhaR=await adharModel.findOne({AdharNumber:AdharNumber})
    if(unique) return res.status(400).send({Result:false,Massage:"this Aadhar Nambur is allready Provided,please try another Numbur!"})
    
    let match=await adharModel.findOne({AdharNumber:AdharNumber,FullName:FullName,userId:userId})
    if(match) return res.status(400).send({Result:false,Massage:"This Aadhar is allredy created !!"})

    let saveddata=await adharModel.create(data)  
    return res.status(201).send({Result:true,massage:"Adhar created sucssesfully",data:saveddata}); 
} catch (error) {
    return res.status(500).send({Error:error.message})
    }}  

//                  o============o  getAadhar  o============o

const getAadhar=async function(req,res){
try {
    let Aadhar =req.body
    let {docId}=req.params
    let {AdharNumber}=Aadhar

    if(Object.keys(Aadhar).length==0)
    return res.status(400).send({msg:"empty format is not required !"})

    if(!AdharNumber) return res.status(400).send({message:"Please provide a Adhar Numbar"})
    if(!(AdharNumber.length==12)) return res.status(400).send({status:false,Msg:"Please provide a valied AdharNumber (12 digit)"})

    let getAdhar=await adharModel.findOne({AdharNumber:AdharNumber})
    if(!getAdhar) return res.status(404).send({Massage:"This AdharNumber is not exist,Please try another numbar!!"})
    return res.status(200).send(getAdhar)

} catch (error) {
    return res.status(500).send(error)
    }}

//                  o============o  updateAdhar  o============o

const updateAdhar=async function(req,res){
try {
    let data=req.body
    let {docId}=req.params

    if(Object.keys(data).length==0)
    return res.status(400).send({msg:"empty format is not required !"})

    let body=Object.keys(data)
    let mandatory=["FullName","DateOfBirth","age","mobail","address"]

    for(let i=0; i<body.length;i++){
    if(!mandatory.includes(body[i])){
    return res.status(400).send({Massage:"This is not updated field,please update another field!!"})
    }}
    let update=await adharModel.findOneAndUpdate({userId:docId},req.body,{new:true})
    if(update) return res.status(200).send({Status:true,Msg:"Adhar is sucssesfully updated!!",update})
    } 
catch (error) {  
    return res.status(500).send(error)
    }}

//                o============o  deletedAdhar  o============o

const deletedAdhar=async function(req,res){
try {
    let data =req.body
    let {docId}=req.params

    if(Object.keys(data).length==0)
    return res.status(400).send({msg:"empty format is not required !"})

    let {AdharNumber}=data
    if(!AdharNumber) return res.status(400).send({status:false,Msg:"Please provide a Aadhar namber"})
    if(!(AdharNumber.length==12)) return res.status(400).send({status:false,Msg:"Please provide a valied AdharNumber (12 digit)"})

    let dele=await adharModel.findOne({AdharNumber:AdharNumber})
    if(!dele) return res.status(404).send({Msg:"This Aadhar Numabar is not Exist,please Provide a valied AadharNumbar"})

    let delet=await adharModel.findOneAndDelete({AdharNumber:AdharNumber,userId:docId})  
    return res.status(200).send({Msg:"Aadhar is sucssesfully deleted"})
    }
catch (error) {
    return res.status(500).send(error)
    }}

//                                * exports *

module.exports={createAdhar,getAadhar,updateAdhar,deletedAdhar}