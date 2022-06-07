const Sequelize = require("sequelize");
const logger=require('../utils/logger.js')
require('dotenv').config()

const db = new Sequelize(process.env.DATABASENAME,process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: "postgres",
  port: process.env.PORT,
  operatorsAliases: 0,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

db.authenticate()
  .then(() => 
  logger.customLogger.log('info',"Database connected"))
  .catch((err) => logger.customLogger.log('error',"Error: "+err));

module.exports = db;
