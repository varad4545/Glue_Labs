const express = require("express");
const db = require("../../config/database");
const users = require("../models").users;
const blog = require("../models").blogposts;
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {authAdminAccess,authToken,} = require("../middlewares/authmiddlewares");
const {validateDeleteuserAdmin,validateUpdateuserAdmin}=require("../middlewares/JoiValidatemiddleware")
const logger=require('../../utils/logger')
require("dotenv").config();
require("../auth/passport");
const swaggerUi=require('swagger-ui-express');
const swaggerJsDocs=require('swagger-jsdoc')
const redisClient=require('../../utils/redisClient.js')
const DEFAULT_EXPIRATION = 3600;

//get all users
router.get("/admin/getusers/:id",authAdminAccess(),authToken,async (req, res) => {
    let getCacheData = await redisClient.get("usersforAdmin");
    if (getCacheData) {
      console.log("Cache Hit");
      return res.json(JSON.parse(getCacheData));
    } else {
      console.log("Cache Miss");
      const getusers = await users.findAll({ where: { role: "basic" } });
      if (getusers) {
        redisClient.setEx(
          "usersforAdmin",
          DEFAULT_EXPIRATION,
          JSON.stringify(getusers)
        );
        res.status(200).send(getusers);
      } else {
        res.status(400).send("No users");
      }
    }
  }
);

//get all blogs
router.get("/admin/getblogs/:id",authAdminAccess(),authToken,async (req, res) => {
    let getCacheData = await redisClient.get("blogsforAdmin");
    console.log(typeof getCacheData);
    if (getCacheData) {
      console.log("Cache Hit");
      return res.json(JSON.parse(getCacheData));
    } else {
      console.log("Cache Miss");
      const getusers = await blog.findAll();
      if (getusers) {
        redisClient.setEx(
          "blogsforAdmin",
          DEFAULT_EXPIRATION,
          JSON.stringify(getusers)
        );
        res.status(200).send(getusers);
      } else {
        res.status(400).send("No Blogs");
      }
    }
  }
);

//delete individual users
router.delete("/admin/deleteusers/:id", authAdminAccess(),authToken,validateDeleteuserAdmin, async (req, res) => {
  const deleteid = req.body.id;
  var finduser = await users.findOne({ where: { id: deleteid } });
  if (finduser) {
    finduser = finduser.toJSON();
    if (finduser.role === "admin") {
      res.send("Other Admins cannot be deleted");
    } else {
      users
        .destroy({ where: { id: deleteid } })
        .then((data) => {
          res.status(200).send("User deleted")
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
      blog
        .destroy({ where: { id: deleteid } })
        .then((data) => {
          res.status(200).send("BLog entry deleted")
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
    }
  } else {
    res.status(400).send("User not found")
  }
});

//update individual users
router.put("/admin/updateusers/:id", authAdminAccess(),authToken,validateUpdateuserAdmin, async (req, res) => {
  updateid = req.body.id;
  var finduser = await users.findOne({ where: { id: updateid } });
  if (finduser) {
    finduser = finduser.toJSON();
    if (finduser.role === "admin") {
      res.status(403).send("Other Admins cannot be updated")
    } else {
      const updatedData = {
        id: updateid,
        email: req.body.email,
      };
      users
        .update(updatedData, { where: { id: updateid } })
        .then((data) => {
          res.status(200).send("Updated User")
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
      blog
        .update(updatedData, { where: { id: updateid } })
        .then((data) => {
          res.status(200).send("Updated Blog")
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
    }
  } else {
    res.status(400).send("User not found")
  }
});

module.exports = router;
