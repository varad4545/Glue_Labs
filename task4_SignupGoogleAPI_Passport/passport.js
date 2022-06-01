
const passport=require('passport')
const express = require('express')
const router=express.Router();
const routes=require('./routes/routes')
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const users = require('./models/users');

router.get('/exist',(req,res)=>{
    res.send("User Already Exists")
})

passport.serializeUser(function(user,done){
    done(null,user)
})
passport.deserializeUser(function(user,done){
    done(null,user)
})


passport.use(new GoogleStrategy({
    clientID:"710290063066-na521135smc77vr3hgkihtmpc2stq2n5.apps.googleusercontent.com",
    clientSecret:"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",
    callbackURL:"/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, done) {
      console.log(profile)
      console.log(accessToken)
      const account = profile._json;
      const count=await users.count();
      console.log(count)
      const alreadyExistUser=await users.findOne({where:{google_id:account.sub}}).catch(
        (err)=>{
            console.log("Error: ",err)
        }
    )
  
    if(!alreadyExistUser)
    {
      

      users.create({
          id: count,
          username:account.name,
          img:account.picture,
          google_id:account.sub,
          password:accessToken,
      }).then(value=>{
        console.log("User added to database")
  
    }).catch(error=>{
        console.log(error)
    })
    return done(null,profile)
   }
   else{
       console.log("User already exists")
       return done("User already exists")
   }

  
  }
));
