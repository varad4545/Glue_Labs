const express = require("express");
const db = require("../config/database");
const users = require("../models/users");
const blog = require("../models/blogpost");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const logger=require('../utils/logger')
const {authRoleLogin,authBasic,authAdminAccess} = require("../middlewares/authmiddlewares");
const {validateUser}=require("../middlewares/JoiValidatemiddleware")
require("dotenv").config();
require("../auth/passport");
const swaggerJsDocs=require('swagger-jsdoc')


/**
 * @swagger
 *  components:
 *    schemas:
 *      User: 
 *        type: object
 *        properties: 
 *          id:
 *            type: number
 *          email:
 *            type: string
 *          password:
 *            type: string  
 */

/**
 * @swagger
 * /register/basic:
 *  post:
 *    description: Add users
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: User successfully added
 */

/**
 * @swagger
 * /register/admin:
 *  post:
 *    description:  Add Admins
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: Admin successfully added
 */

/**
 * @swagger
 * /login/basic:
 *  post:
 *    description: Login users
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: User successfully login
 */

/**
 * @swagger
 * /login/admin:
 *  post:
 *    description: Login Admins
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: Admin successfully login
 */




//register normal user
router.post("/register/basic",validateUser, async (req, res) => {
  const { id, email, password } = req.body;
  const alreadyExistUser = await users
    .findOne({ where: { email } })
    .catch((err) => {
      logger.customLogger.log('error',"Error: "+err)
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
      res.send("User registered")
   
    })
    .catch((err) => {
      logger.customLogger.log('error',"Error: "+err)
    });
});

//login normal user
router.post("/login/basic", authRoleLogin("basic"), async (req, res) => {
  const { email, password } = req.body;
  const userWithEmail = await users
    .findOne({ where: { email } })
    .catch((err) => {
      logger.customLogger.log('error',"Error: "+err)
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
router.post("/register/admin", validateUser,async (req, res) => {
  const { id, email, password } = req.body;
  const alreadyExistUser = await users
    .findOne({ where: { email } })
    .catch((err) => {
      logger.customLogger.log('error',"Error: "+err)
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
      res.send("Admin registered")
    
      id1 = id1 + 1;
    })
    .catch((err) => {
      logger.customLogger.log('error',"Error: "+err)
    });
});

//login admin
router.post("/login/admin", authRoleLogin("admin"), async (req, res) => {
  const { email, password } = req.body;
  const userWithEmail = await users
    .findOne({ where: { email } })
    .catch((err) => {
      logger.customLogger.log('error',"Error: "+err)
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
