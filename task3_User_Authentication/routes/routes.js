const express=require('express')
const db = require('../config/database');
const users = require('../models/users');
const router=express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passport=require('passport');
require("dotenv").config();
require('../auth/passport')

//get method
router.get("/",(req,res)=>
{

    users.findAll().
    then(
        user=>{
            console.log(user);
            res.send(user)
        }
    )
    .catch(
        err=>console.log(err)
    )
    
})

//register method

router.post('/register',async (req,res)=>
{

    const {id,email,password}=req.body;
    
   const alreadyExistUser=await users.findOne({where:{email}}).catch(
       (err)=>{
           console.log("Error: ",err)
       }
   )
   if(alreadyExistUser){
       return res.send("User with Email exists")
   }
 
    users.create({
        id:id,
        email:email,
        password:password,
        

    }).then(value=>{
        console.log("User registered")
        id1=id1+1
    }).catch(error=>{
        console.log(error)
    })
})

//login
router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    const userWithEmail=await users.findOne({where:{email}}).catch((err)=>{
        console.log("Error: ",err)
    })
    if(!userWithEmail){
        return res.send("Email or password does not match")
    }
    if(userWithEmail.password!==password){
        return res.send("Email or password does not match")
    }
    const jwtToken=jwt.sign({id:userWithEmail.id,email:userWithEmail.email},process.env.JWT_KEY)
    res.json({message: "Welcome Back!",token:jwtToken})
})

//profile - accesible through token
router.get(
    "/profile",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.send("Welcome to your profile");
    }
  );


module.exports= router