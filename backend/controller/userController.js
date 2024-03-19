const express= require("express");
const route= express.Router();
const {Sequelize, DataTypes}= require("sequelize");
const sequelize= require("../util/database")
const Signup= require("../modal/signup")
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const Expense= require("../modal/expense")


function generateAccessToken(id, email, isPremiumUser) {
  return jwt.sign({ userId: id, email: email, isPremiumUser: isPremiumUser }, "secretKey");
}

async function SignupController(req, res, next) {
  const t = await sequelize.transaction();
  const { name, email, password } = req.body;

  try {
    const existingUser = await Signup.findOne({ where: { email: email }, transaction: t });

    if (existingUser) {
      await t.rollback();
      return res.status(400).send('Email already exists');
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      try {
        const SignUp = await Signup.create({ name, email, password: hash }, { transaction: t });
        await t.commit();
        return res.status(201).json(SignUp);
      } catch (error) {
        await t.rollback();
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Error creating user.' });
      }
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Error creating user.' });
  }
}

async function postUserLogin(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User doesn't Exists!",
      });
    }

    bcrypt.compare(password, user.password, async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Something went Wrong!" });
      }

      if (result == true) {
        return res.status(200).json({
          success: true,
          message: "Login Successful!",
          token: generateAccessToken(user.id, user.email, user.isPremiumUser)
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Password Incorrect!",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Something went Wrong!" });
  }
}

function isPremiumUser(req, res, next) {
  if (req.user.isPremiumUser) {
    return res.json({ isPremiumUser: true });
  }
}

module.exports = {
  generateAccessToken,
  SignupController,
  postUserLogin,
  isPremiumUser,
};
