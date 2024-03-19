const Razorpay = require("razorpay");
const Order = require("../modal/orderModel");
const userController = require("./userController");
const sequelize= require("../util/database")
const {Sequelize, DataTypes}= require("sequelize");
require("dotenv").config();

exports.purchasePremium = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 50000;
    
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        await t.rollback();
        throw new Error(JSON.stringify(err));
      }
      try {
        await req.user.createOrder({ orderid: order.id, status: "PENDING" }, { transaction: t });
        await t.commit();
        return res.status(201).json({ order, key_id: rzp.key_id });
      } catch (error) {
        await t.rollback();
        throw new Error(error);
      }
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id }, transaction: t });
    if (!order) {
      await t.rollback();
      return res.status(404).json({ error: 'Order not found' });
    }
    await Promise.all([
      order.update({ paymentid: payment_id, status: "SUCCESSFUL" }, { transaction: t }),
      req.user.update({ isPremiumUser: true }, { transaction: t })
    ]);
    await t.commit();
    return res.status(202).json({
      sucess: true,
      message: "Transaction Successful",
      token: userController.generateAccessToken(userId, undefined, true),
    });
  } catch (err) {
    console.log(err);
    await t.rollback();
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};
