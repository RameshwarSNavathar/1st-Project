const express=require("express")
const mongoose=require("mongoose")
const app =express()
app.use(express.json())
const router=require("./src/route/route")



mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://Rameshwar:kkX7KQpRaKAxNuew@programr.r4qditm.mongodb.net/?retryWrites=true&w=majority")

.then(()=>{console.log("Database is Conected * !")})
.catch((err)=>{console.log(err)})


app.use("/",router)


app.listen(4000,function(){
    console.log("Server is Start * !"+4000)
})