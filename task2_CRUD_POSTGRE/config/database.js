
const Sequelize = require('sequelize');
module.exports =  new Sequelize('taskDataBase1','postgres','Satara@2090',
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

