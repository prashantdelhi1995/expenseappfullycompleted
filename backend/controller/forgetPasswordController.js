const express=require("express");
const path = require("path");
const Signup= require("../modal/signup")
const ResetPassword = require("../modal/resetPasswordModel");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;
const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRounds);
  };
 

module.exports.forgetPassword = async (req,res,next)=>{

    try{
    const email=req.body.email;
    requestId = uuidv4();
    console.log(">>>>>>>>>>>>>>>>",email,requestId)
    const  recepientEmail= await Signup.findOne({where:{email:email}})
    console.log(">>>>>>>>>>>>>>>>", recepientEmail)
    if(!recepientEmail){
        return res
        .status(404)
        .json({ message: "Please provide the registered email!" });
    }
    else{
        const resetRequest = await ResetPassword.create({
            id: requestId,
            isActive: true,
            SignUpId: recepientEmail.dataValues.id
          });
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.RESET_PASSWORD_API_KEY;
    const transEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "singhprashant674@gmail.com",
      name: "prashant",
    };
    const receivers = [
      {
        email: email,
      },
    ];
    const emailResponse = await transEmailApi.sendTransacEmail({
      sender,
      To: receivers,
      subject: "Expense Tracker Reset Password",
      textContent: "Link Below",
      htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
      <a href="http://localhost:3000/password/resetPasswordPage/{{params.requestId}}"> Click Here</a>`,
      params: {
        requestId: requestId,
      },
    });
    return res.status(200).json({
      message:
        "Link for reset the password is successfully send on your Mail Id!",
    });
    }
    } catch (error) {
    console.log("error");
    return res.status(409).json({ message: "failed changing password" });
  }
};

exports.reset = async (req, res, next) => {
  const result = await ResetPassword.findOne({
    where: { id: req.params.id },
  });
  
  if (result) {
    if (result.isActive == true) {
      res
        .status(200)
        .sendFile(path.join(__dirname, '../', "views", "newPassword.html"))
        
      await result.update({ isActive: false });
    }
  }
};

exports.update = async (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashed) => {
    ResetPassword 
      .findOne({ where: { id: req.body.id } })
      .then((result) => {
        const id=result.dataValues.SignUpId

        Signup.update({ password: hashed }, { where: { id: id } })
        res.send("SUCCESS");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};




// exports.updatePassword = async (req, res, next) => {
//     try {
//       const requestId = req.headers.referer.split("/");
//       const password = req.body.password;
//       const checkResetRequest = await ResetPassword.findAll({
//         where: { id: requestId[requestId.length - 1], isActive: true },
//       });
//       if (checkResetRequest[0]) {
//         const userId = checkResetRequest[0].dataValues.userId;
//         const result = await ResetPassword.update(
//           { isActive: false },
//           { where: { id: requestId } }
//         );
//         const newPassword = await hashPassword(password);
//         const user = await User.update(
//           { password: newPassword },
//           { where: { id: userId } }
//         );
//         return res
//           .status(200)
//           .json({ message: "Successfully changed password!" });
//       } else {
//         return res
//           .status(409)
//           .json({ message: "Link is already Used Once, Request for new Link!" });
//       }
//     } catch (err) {
//       console.log(err);
//       return res.status(409).json({ message: "Failed to change password!" });
//     }
//   };
  


    

