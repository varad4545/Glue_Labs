
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport=require('passport')
const session=require('express-session')
require('./passport')
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

const isLoggedIn=(req,res,next)=>{
    if(req.user){
        next();
    }
    else{
        res.sendStatus(401);
    }
}
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));

app.use(passport.initialize())
app.use(passport.session());

app.get('/',(req,res)=>
   res.redirect('/login')
)

app.get('/login', (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
  });

app.get("/auth/google",passport.authenticate("google",{ 
    scope:["profile",'email']
}))


app.get("/auth/google/callback",passport.authenticate('google',{failureRedirect: '/failed'}),
  function(req,res){
      res.redirect('/good');
  })

app.get('/failed',(req,res)=>res.send("Ypu failed to log in"))

app.get('/good',isLoggedIn,(req,res)=>{
 
    res.send(`Welcome mr ${req.user.displayName}!, Logout using- <a href="/logout">Logout</a>` )
})

app.get('/logout',(req,res)=>{
    req.session.destroy();
    res.redirect('/');
})


app.listen(5002, () => console.log(`Example app listening on port ${5002}!`))

