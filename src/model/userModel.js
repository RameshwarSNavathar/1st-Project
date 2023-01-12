const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

firstName: { type: String,require:true },
lastName: {type: String,require:true },

Email:{
      type: String,
      require: true,
      unique: true,
      trim: true,
      },

Password:{
      type: String,
      require: true,
      unique: true,
      trim: true,
      },

ConfirmPassword:{type: String}

},{ timestamps: true });

module.exports = mongoose.model("user", userSchema);

