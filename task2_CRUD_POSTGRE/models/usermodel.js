
const Sequelize = require('sequelize');
const db = require('../config/database');
const usermodel = db.define('users',
{
    id:{
        type: Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    phonenumber:{
        type:Sequelize.INTEGER
    }
},
{
    timestamps:false
}
)
module.exports = usermodel;