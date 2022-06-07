const express = require("express");
const db = require("../../config/database");
const users = require("../models/users");
const blog = require("../models/blogpost");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const logger=require('../../utils/logger')
const {authRoleLogin,authBasic,authAdminAccess} = require("../middlewares/authmiddlewares");
const {validateSignUp, validateLogin,validateChangePassword}=require("../middlewares/JoiValidatemiddleware")
require("dotenv").config();
require("../auth/passport");
const swaggerJsDocs=require('swagger-jsdoc')

 function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_KEY, { expiresIn: "8h" });
}

//Home
 router.get('/homepage',(req,res)=>{
  res.status(200).send("Welcome to Blog App. Kindly register or Login")

})

//register 
router.post("/register",validateSignUp, async (req, res) => {
  const { id, email, password,role } = req.body;
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
      role: role,
    })
    .then((value) => {
      res.status(200).send("User registered")
    })
    .catch((err) => {
      logger.customLogger.log('error',"Error: "+err)
    });
});

//refreshToken
router.get("/refreshToken/:id", async (req, res) => {
  const id = req.params.id;
  const user_data = await users.findOne({where: {id:id}});
  console.log(user_data)
  if (user_data == null) return res.sendStatus(401);
  if (!user_data.refreshtoken) return res.sendStatus(403);
  jwt.verify(user_data.refreshtoken, process.env.REFRESH_TOKEN_KEY, (err, user) => {
    console.log(user)
    if (err) res.sendStatus(403);
    const accessToken = generateAccessToken({email:user.email})
    res.json({ accessToken: accessToken });
  });
});

//login 
router.post("/login",validateLogin, async (req, res) => {
  const { email, password } = req.body;
  const userWithEmail = await users
    .findOne({ where: { email:email } })
    .catch((err) => {
      logger.customLogger.log('error',"Error: "+err)
    });
  
  if (!userWithEmail) {
    return res.status(200).send("Email or password does not match");
  }
  if (userWithEmail.password !== password) {
    return res.status(200).send("Email or password does not match 2");
  }

  const user={ id: userWithEmail.id, email: userWithEmail.email }
  const accessToken = generateAccessToken(user)
  const refreshToken=jwt.sign(
    user,
    process.env.REFRESH_TOKEN_KEY
  );
  users.update({refreshtoken:refreshToken},{where:{id:userWithEmail.id}})
  res.status(200).json({ message: "Welcome Back!", accessToken: accessToken,refreshToken:refreshToken });
});

//changepassword
router.post("/changepassword",validateChangePassword,async(req,res)=>{
  const body = req.body;
  const locateEntry = await users.findOne({ where: { email: body.email } });
  const getEntry = locateEntry.toJSON();
  const oldpassword = getEntry.password;
  if(oldpassword===body.oldpassword)
  {
  users
    .update(
      {
        password: body.newpassword
      },
      { where: { id:getEntry.id } }
    )
    .then((value) => {
      res.status(200).send("Password Updated")
    })
    .catch((error) => {
      logger.customLogger.log('error',"Error: "+err)
    });
  }
  else
  {
      res.status(400).send("Enter the old password correctly")
  }
})

//logout
router.delete('/logout/:id',async(req,res)=>{
      const user=await users.findOne({where:{id:req.params.id}})
      if(user.refreshToken){
        users.update({refreshtoken: null},{where:{id}})
      }
      res.status(200).send("Logged out")
})


module.exports = router;
