const Sequelize = require("sequelize");
const logger=require('../utils/logger')
const db = new Sequelize("taskDataBase1", "postgres", "Satara@2090", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  operatorsAliases: 0,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

db.authenticate().
then
(
    ()=>
    {
        logger.customLogger.log('info',"Database connected")
    }
)
.catch
(
    err=>
    {
        logger.customLogger.log('error',"Error: "+err)
      
    }
)


module.exports = db;
