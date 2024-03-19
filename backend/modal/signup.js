const {Sequelize, DataTypes}= require("sequelize");
const sequelize= require ("../util/database.js");
const Signup = sequelize.define('SignUp', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isPremiumUser: Sequelize.BOOLEAN,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalspend: Sequelize.INTEGER,
    thype: {
      type: DataTypes.INTEGER,
      defaultValue:0
      
    }
  });
  module.exports=Signup;