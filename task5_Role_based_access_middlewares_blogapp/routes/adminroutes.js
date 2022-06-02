const express = require("express");
const db = require("../config/database");
const users = require("../models/users");
const blog = require("../models/blogpost");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {authRoleLogin,authBasic,authAdminAccess} = require("../middlewares/middleware");
require("dotenv").config();
require("../auth/passport");

//get all users
router.get("/admin/getusers/:id", authAdminAccess(), async (req, res) => {
  const getusers = await users.findAll({ where: { role: "basic" } });
  if (getusers) {
    const getuserlist = JSON.stringify(getusers);
    console.log(getuserlist);
    res.send(getusers);
  } else {
    res.send("No users");
  }
});

//get all blogs
router.get("/admin/getblogs/:id", authAdminAccess(), async (req, res) => {
  const getusers = await blog.findAll();
  if (getusers) {
    const getuserlist = JSON.stringify(getusers);
    console.log(getuserlist);
    res.send(getusers);
  } else {
    res.send("No users");
  }
});

//delete individual users
router.delete("/admin/deleteusers/:id", authAdminAccess(), async (req, res) => {
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
          res.send("User deleted");
        })
        .catch((err) => {
          console.log(err);
        });

      blog
        .destroy({ where: { id: deleteid } })
        .then((data) => {
          res.send("BLog entry deleted");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    res.send("User not found");
  }
});

//update individual users
router.put("/admin/updateusers/:id", authAdminAccess(), async (req, res) => {
  updateid = req.body.id;
  var finduser = await users.findOne({ where: { id: updateid } });
  if (finduser) {
    finduser = finduser.toJSON();
    if (finduser.role === "admin") {
      res.send("Other Admins cannot be updated");
    } else {
      const updatedData = {
        id: updateid,
        email: req.body.email,
      };
      users
        .update(updatedData, { where: { id: updateid } })
        .then((data) => {
          res.send("Updated User");
        })
        .catch((err) => {
          console.log(err);
        });
      blog
        .update(updatedData, { where: { id: updateid } })
        .then((data) => {
          res.send("Updated Blog");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    res.send("User not found");
  }
});

module.exports = router;
