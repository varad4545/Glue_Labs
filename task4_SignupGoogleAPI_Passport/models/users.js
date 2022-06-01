const  Sequelize  = require("sequelize");
const db = require("../config/database");

const users = db.define("googleusers", {
  id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  img: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  google_id:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false,
  }
  
},{
    timestamps:false
});

module.exports = users;