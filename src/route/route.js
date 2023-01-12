const expess=require("express")
const route=expess.Router()

const adharCon=require("../controller/adharController")
const userCon=require("../controller/userController")
const {authentication,Authrisation} =require("../meddlewar/reuseble")

route.post("/register",userCon.RegisterUser)
route.post("/Login",userCon.loginUser)  
route.delete("/LogOut-User",userCon.logoutUser)
route.post("/creteAadhar/:docId",authentication,Authrisation,adharCon.createAdhar)  
route.get("/seeAdhar/:docId",authentication,Authrisation,adharCon.getAadhar)
route.put("/updateAdhar/:docId",authentication,Authrisation,adharCon.updateAdhar)
route.delete("/deletAadhar/:docId",authentication,Authrisation,adharCon.deletedAdhar)


route.all("/*",function(req,res){
return res.status(400).send({msg:"Path is invalied"})})



module.exports=route  