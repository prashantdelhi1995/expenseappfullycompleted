const { Sequelize, DataTypes } = require('sequelize');
const appcontroller=require("../controller/expense");
const middleware=require("../middleware/middleware")

const express = require('express');
const router = express.Router();

router.get('/get-expense', middleware , appcontroller.getExpense );
router.post('/add-expense', middleware , appcontroller.postExpense );
router.put('/edit-expense/:id' , appcontroller.putExpense );
router.delete('/delete-expense/:id',middleware,appcontroller.DeleteExpense);
router.get("/user/download",middleware,appcontroller.download    )

module.exports= router