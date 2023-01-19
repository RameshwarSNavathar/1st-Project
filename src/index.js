const express = require("express");
const mongoose = require("mongoose");
const app = express();
const route = require("./routes/route");


app.use(express.json());

mongoose.connect("")
.then(() => {console.log("Project3 mongoDB connected")})
.catch((errors) => {console.log(errors.message)})



app.use("/", route);

app.listen(4000, function () {
  console.log("express running on PORT "+ 3000)
})
