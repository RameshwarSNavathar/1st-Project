const express = require("express")
const router = express.Router()

router.get("/test",function(){
    console.log("test");
});


module.exports = router
