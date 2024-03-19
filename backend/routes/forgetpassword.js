const express=require("express");
const router=express.Router();
const forgetPassword=require("../controller/forgetPasswordController");
router.post("/forgotpassword",forgetPassword.forgetPassword)
router.get("/resetPasswordPage/:id", forgetPassword.reset);

router.post("/update", forgetPassword.update);


// router.get('/updatepassword/:resetpasswordid', resetpasswordController.updatepassword)

// router.get('/resetpassword/:id', resetpasswordController.resetpassword)

// router.use('/forgotpassword', resetpasswordController.forgotpassword)




module.exports=router