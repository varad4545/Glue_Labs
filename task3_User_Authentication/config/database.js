const Sequelize = require('sequelize');
const db =  new Sequelize('taskDataBase1','postgres','Satara@2090',
{
    host:'localhost',
    dialect:'postgres',
    port:5432,
    operatorsAliases: false,
    pool:
    {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
});

module.exports=db
