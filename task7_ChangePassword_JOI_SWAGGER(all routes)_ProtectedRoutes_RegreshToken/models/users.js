const Sequelize = require("sequelize");
const db = require("../config/database");

const user = db.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    refreshtoken:{
      type: Sequelize.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: false,
  }
);

module.exports = user;
