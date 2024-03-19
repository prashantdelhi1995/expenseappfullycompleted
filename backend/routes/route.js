const express= require("express");
const route= express.Router();
const {Sequelize, DataTypes}= require("sequelize");
const sequelize= require("../util/database")
const Signup= require("../modal/signup")
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const userController=require("../controller/userController");



route.post("/user/signup", userController.SignupController);


    route.post("/user/login", userController.postUserLogin);
    


          
            
          
       
      
route.get("/",(req,res)=>{
    res.send("<h1>hiii everyone</h1>")
})





module.exports=route;