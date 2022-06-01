
const express = require('express')
const passport=require('passport')
const session=require('express-session')
require('../passport')
const router=express.Router();

const isLoggedIn=(req,res,next)=>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}
router.get('/',(req,res)=>
   res.redirect('/SignUp')
)

router.get('/SignUp', (req, res) => {
    res.send('<a href="/auth/google">Sign up with Google</a>');
  });

  router.get("/auth/google",passport.authenticate("google",{ 
    scope:["profile",'email']
}))


router.get("/auth/google/callback",passport.authenticate('google',{failureRedirect: '/failed'}),
  function(req,res){
      res.redirect('/good');
  })

router.get('/failed',(req,res)=>res.send("You failed to log in"))

router.get('/good',isLoggedIn,(req,res)=>{
 
    res.send(`Welcome mr ${req.user.displayName}!, Logout using- <a href="/logout">Logout</a>` )
})

router.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})

module.exports=router;