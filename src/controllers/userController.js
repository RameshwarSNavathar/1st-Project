const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {isValidString,isvalidMobile,isValidEmail,isValidPass,isValidPincode,isValidCity} = require("../validator/validator");
/******************************user register *****************************/

const createUser = async function (req, res) {
  try {
    let data = req.body;
    const { title, name, phone, email, password, address} = data;
    //------------------>>-validations-<<----------------------<<
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "please provide the request body" });
    //------------------------>>-title-<<----------------------<<
    if (!title) return res.status(400).send({ status: false, message: "title is required" });

    let titles = ["Mr", "Mrs", "Miss"];
    if (!titles.includes(title)) return res.status(400).send({status: false, message: "please provide the valid title Mr or Mrs or Miss "});

    //-------------------------->>-name-<<----------------------<<
    if (!name) return res.status(400).send({ status: false, message: "name is required" });
    if (!isValidString(name)) return res.status(400).send({ status: false, message: "please provide the valid name" });

    //-------------------------->>-phone-<<----------------------<<
    if (!phone) return res.status(400).send({ status: false, message: "phone is required" });
    if (!isvalidMobile(phone)) return res.status(400).send({status: false, message: "please provide the valid phone number"});

    let mobile = await userModel.findOne({ phone: phone });
    if (mobile) return res.status(400).send({status: false,message: "this phone number is already exists"});

    //-------------------------->>-email-<<----------------------<<

    if (!email) return res.status(400).send({ status: false, message: "email is required" });
    if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "please provide the valid emailId" });
    
    let emailId = await userModel.findOne({ email: email });
    if (emailId) return res.status(400).send({ status: false, message: "this emailId is already exists" });

    //-------------------------->>-password-<<---------------------<<
    if (!password) return res.status(400).send({ status: false, message: "password is required" });
    if (!isValidPass(password)) return res.status(400).send({status: false,message: "please provide the valid or strong password length betweeen 8 to 15"});

    //------------------------->>-address-<<-----------------------<<
    if(address){
    const {pincode,street,city} = address
    if(city){
      if(!isValidCity(city)) return res.status(400).send({status:false,message:"please provide the valid city name"})
      }
    if(pincode){
      if(!isValidPincode(pincode)) return res.status(400).send({status:false,message:"please provide the valid pincode"})
      }
    }

    //------------------------>>-createUser-<<-----------------------<<
    const user = await userModel.create(data);
    return res.status(201).send({ status: true, message: "User created successfully" ,data: user});

  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

/******************************userLogin******************************/
const userLogin = async function (req, res) {
  try {
    const data = req.body;
    const { email, password } = data;
    //---->>-validation..
    if (Object.keys(data).length == 0) return res.status(400).send({ status: false, message: "Data not found in body" });

    //----->>-email..
    if (!email) return res.status(400).send({ status: false, message: "email is required" });
    if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "please provide the valid emailId" });
    
    let emailId = await userModel.findOne({ email: email });
    if (!emailId) return res.status(404).send({status: false,message: "your account not found please create account first"});

    //----->>-password..
    if (!password) return res.status(400).send({ status: false, message: "password is required" });
    if (!isValidPass(password)) return res.status(400).send({status: false,message: "please provide the valid or strong password"});

    let getUsersData = await userModel.findOne({email: email,password: password ,isDeleted: false});
    if (!getUsersData) return res.status(401).send({ status: false, message: "Enter a valid Email or Password" });

    let token = jwt.sign(
      {userId: getUsersData._id.toString()},
      "Book-mgmt",
      { expiresIn: 30*60 }
    );
    
    res.setHeader("x-api-key", token);
    return res.status(200).send({status: true,message: "Success",data: { userId: getUsersData._id, token: token }});
  } catch (err) {
    res.status(500).send({ status: false, message: err.message });
  }
};

module.exports = {createUser ,userLogin};