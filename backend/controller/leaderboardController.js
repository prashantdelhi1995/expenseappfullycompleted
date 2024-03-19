
const {Sequelize, DataTypes}= require("sequelize");
const express=require("express");
const sequelize= require("../util/database")
const Signup= require("../modal/signup")
const Expense= require("../modal/expense")

module.exports.getleaderboard = async (req, res, next) => {
  try {
      const t = await sequelize.transaction();

      const userLeaderBoardDetails = await Signup.findAll({
          attributes: ['name', 'totalspend'],
          order: [['totalspend', 'DESC']],
          transaction: t
      });

      await t.commit();

      res.status(200).json(userLeaderBoardDetails);
  } catch (err) {
      if (t) await t.rollback(); // Rollback transaction if an error occurs
      res.status(400).json(err);
  }
};

