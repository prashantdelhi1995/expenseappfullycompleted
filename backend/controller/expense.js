const { Sequelize, DataTypes } = require('sequelize');
const sequelize=require("../util/database")
const Expense=require("../modal/expense")
const middleware=require("../middleware/middleware")
const Signup= require("../modal/signup")
const Uploads = require("../modal/fileuploadModel")



require("dotenv").config()

const AWS = require("aws-sdk");
// module.exports.getExpense= async (req, res) => {
 
//   const page = req.query.page || 1; // Get the requested page number
//   const limit = req.query.limit || 10; // Number of items per page
//   const offset = (page - 1) * limit
//   console.log("********",page,limit)
//   const t= await sequelize.transaction();
//     try {
//       let result = await Expense.findAll({where:{SignUpId:req.user.id}, limit: limit, offset: offset, transaction:t});
      
//       res.json(result);
  
//       //await t.commit();
//       //res.json(data);
//     } catch (error) {
//       console.error('Error fetching users:', error);
//       //await t.rollback(); 
      
//       res.status(500).json({ error: 'Error fetching users.' });
//     }
//   }
module.exports.getExpense = async (req, res) => {
  
  const page = parseInt(req.query.page) || 1; // Get the requested page number
  const limit =  parseInt(req.query.limit) || 10; // Number of items per page
  const offset = (page - 1) * limit;
  console.log("********", page, limit);
  console.log("Requested Page:", page);
  console.log("Limit:", limit);
  console.log("Offset:", offset);

  const t = await sequelize.transaction();
  try {
    const totalCount = await Expense.count({ where: { SignUpId: req.user.id }, transaction: t });
    console.log("TOTALCOUNT:",totalCount)
    const result = await Expense.findAll({
      where: { SignUpId: req.user.id },
      limit: limit,
      offset: offset,
      transaction: t
    });
    console.log("alok alok",result)

    await t.commit(); // Commit the transaction

    res.json({
      data: result,
      page: page,
      limit: limit,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    await t.rollback(); // Rollback the transaction in case of error
    res.status(500).json({ error: 'Error fetching expenses.' });
  }
};
  module.exports.postExpense= async (req, res) => {
    const t= await sequelize.transaction();
    const { Amount, Description, categories, date } = req.body;
    
    try {
      console.log("value of id is >>>>>>>>>>>>>", req.user.id)
      const expense = await Expense.create({ Amount, Description, categories, date, SignUpId:req.user.id },{transaction:t});
      console.log(">>>>>totalspend",req.user.totalspend)
      let total_expense= Number(req.user.totalspend) + Number(Amount) ;
      console.log("***************",total_expense);
           await  req.user.update( { totalspend: total_expense},{transaction:t} );
           await t.commit();
      
    



      res.json({ message: 'User created successfully!', expense });
    } catch (error) {
      await t.rollback(); 
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user.' });
    }
  }

  module.exports.putExpense= async (req, res) => {
    const t= await sequelize.transaction();
    const id = req.params.id;
    console.log("id is",id)
    const { Amount, Description, categories } = req.body;
    try {
      const expense = await Expense.findByPk(id,{transaction:t} );
      if (!expense) {
        return res.status(404).json({ error: 'User not found' });
      }
      await expense.update({Amount, Description, categories },{transaction:t} );
      await t.commit();
      res.json({ message: 'User updated successfully!', expense });
    } catch (error) {
      console.error('Error updating user:', error);
      await t.rollback(); 
      res.status(500).json({ error: 'Error updating user.' });
    }
  }

  module.exports.DeleteExpense=async (req, res) => {
 



    const t= await sequelize.transaction();
    const id = req.params.id;
    try {
      const expense = await Expense.findByPk(id ,{transaction:t} );
      if (!expense) {
        return res.status(404).json({ error: 'User not found' });
      }
      let total_expense= Number(req.user.totalspend) - expense.Amount 
      await  req.user.update( { totalspend: total_expense},{transaction:t} );

      await expense.destroy({transaction:t});
      await t.commit();
      res.json({ message: 'User deleted successfully!' });
    } catch (error) {
      console.error('Error deleting user:', error);
      await t.rollback(); 
      res.status(500).json({ error: 'Error deleting user.' });
    }
  }

  exports.download = async (req, res, next) => {
    console.log("hi");
    try {
      const user = req.user;
      const expenses = await Expense.findAll({where :{ SignUpId: req.user.id }});
  
      console.log(expenses);
      const stringifiedExpenses = JSON.stringify(expenses);
      const filename = `${user.id}Expense/${new Date()}.txt`;
  
      const file = await uploadToS3(stringifiedExpenses, filename);
  
      const fileUpload = req.user.createUpload({
        fileUrl: "file",
        fileName: filename
    })
   
  
      
  
      res.status(201).json({ url: file });
    } catch (err) {
      console.log(err);
      res.status(500).json({ err: err });
    }
  };
  
  async function uploadToS3(data, filename) {
    const BUCKET_NAME = "addingphoto";
    const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
    const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

    
    let s3Bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
   
      
    });
  
  
    const params = {
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: data,
      ACL: "public-read",
    };
  
    return new Promise((resolve, reject) => {
      s3Bucket.upload(params, async (err, s3response) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log(s3response);
          resolve(s3response.Location);
        }
      });
    });
  };