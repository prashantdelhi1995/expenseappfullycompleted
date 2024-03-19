const express= require("express");
const bodyParser=require("body-parser");
const sequelize= require ("./util/database.js");
const {Sequelize, DataTypes}= require("sequelize");
const route= require("./routes/route");
const expenseroute= require("./routes/expenseroute");
const SignUp=require("./modal/signup");
const Expense=require("./modal/expense")
const Order=require("./modal/orderModel.js")
const Premium=require("./routes/purchaseMemberShip")
const Leaderboard=require("./routes/leadorboard")
const resetPassword=require("./modal/resetPasswordModel.js")
const Uploads = require("./modal/fileuploadModel.js")

const forgetPassword =require("./routes/forgetpassword")



const app= express();
const cors=require("cors");
const Signup = require("./modal/signup");
app.use(cors())
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(route);
app.use(expenseroute);
app.use("/purchase",Premium)
app.use(Leaderboard);
app.use("/password",forgetPassword)
app.use((req,res,next)=>{
    res.send("<h2>wrong page...</h2>")
});

SignUp.hasMany(Expense);
Expense.belongsTo(SignUp);

Signup.hasMany(resetPassword);
resetPassword.belongsTo(SignUp)

SignUp.hasMany(Order);
Order.belongsTo(SignUp);

SignUp.hasMany(Uploads);
Uploads.belongsTo(SignUp);

(async () => {
    try {
      await sequelize.sync();
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();
