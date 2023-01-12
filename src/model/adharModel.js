const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId


const adharSchema=new mongoose.Schema({

    FullName:{
        type:String,
        require:true,
        trim:true
        },

    DateOfBirth:{
        type:String,
        require:true,
        trim:true
        },

    age:{type:String,require:true},

    mobail:{
        type:Number,
        require:true,
        unique:true,
        trim:true
        },

    address:{
        dist:{type:String,require:true},
        city:{type:String,require:true}
        },
    
    pinCode:{type:Number,require:true},
    
    AdharNumber :{
        type:String,
        require:true,
        unique:true,
        trim:true
        },

    userId:{
        type:ObjectId,
        ref:"user",
        require:true
    }

});


module.exports = mongoose.model("adhar", adharSchema);