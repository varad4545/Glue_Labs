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

//register normal user
router.post("/register/basic", async (req, res) => {
  const { id, email, password } = req.body;
  const alreadyExistUser = await users
    .findOne({ where: { email } })
    .catch((err) => {
      console.log("Error: ", err);
    });
  if (alreadyExistUser) {
    return res.send("User with Email exists");
  }
  users
    .create({
      id: id,
      email: email,
      password: password,
      role: "basic",
    })
    .then((value) => {
      console.log("User registered");
      id1 = id1 + 1;
    })
    .catch((error) => {
      console.log(error);
    });
});

//login normal user
router.post("/login/basic", authRoleLogin("basic"), async (req, res) => {
  const { email, password } = req.body;
  const userWithEmail = await users
    .findOne({ where: { email } })
    .catch((err) => {
      console.log("Error: ", err);
    });
  if (!userWithEmail) {
    return res.send("Email or password does not match");
  }
  if (userWithEmail.password !== password) {
    return res.send("Email or password does not match");
  }
  const jwtToken = jwt.sign(
    { id: userWithEmail.id, email: userWithEmail.email },
    process.env.JWT_KEY
  );
  res.json({ message: "Welcome Back!", token: jwtToken });
});

//register admin
router.post("/register/admin", async (req, res) => {
  const { id, email, password } = req.body;
  const alreadyExistUser = await users
    .findOne({ where: { email } })
    .catch((err) => {
      console.log("Error: ", err);
    });
  if (alreadyExistUser) {
    return res.send("User with Email exists");
  }
  users
    .create({
      id: id,
      email: email,
      password: password,
      role: "admin",
    })
    .then((value) => {
      console.log("User registered");
      id1 = id1 + 1;
    })
    .catch((error) => {
      console.log(error);
    });
});

//login admin
router.post("/login/admin", authRoleLogin("admin"), async (req, res) => {
  const { email, password } = req.body;
  const userWithEmail = await users
    .findOne({ where: { email } })
    .catch((err) => {
      console.log("Error: ", err);
    });
  if (!userWithEmail) {
    return res.send("Email or password does not match");
  }
  if (userWithEmail.password !== password) {
    return res.send("Email or password does not match");
  }
  const jwtToken = jwt.sign(
    { id: userWithEmail.id, email: userWithEmail.email },
    process.env.JWT_KEY
  );
  res.json({ message: "Welcome Back!", token: jwtToken });
});

module.exports = router;
