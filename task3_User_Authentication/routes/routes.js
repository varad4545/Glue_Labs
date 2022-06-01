const express=require('express')
const db = require('../config/database');
const users = require('../models/users');
const blog = require('../models/blogpost');
const router=express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const passport=require('passport');
require("dotenv").config();
require('../auth/passport')


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


//get individual blogs of a user
router.get('/getblog/:id', passport.authenticate("jwt", { session: false }),
    async(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    const locateEntry=await blog.findOne({where:{id:id}});
    const getEntry=locateEntry.toJSON();
    const getPost=getEntry.post
    var setPost=JSON.parse(getPost);
    setPost=setPost.filter((user)=>{
        if(user['title']===body.title){
            return 1;
        
        }
    })
    setPost=JSON.stringify(setPost)
    res.send(setPost)

})

//get all blogs of a user
router.get('/getallblogs/:id', passport.authenticate("jwt", { session: false }),
    async(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    const locateEntry=await blog.findOne({where:{id:id}});
    const getEntry=locateEntry.toJSON();
    const getPost=getEntry.post
    var setPost=JSON.parse(getPost);
    setPost=JSON.stringify(setPost)
    res.send(setPost)

})

//post blogs
router.post("/postblog/:id", passport.authenticate("jwt", { session: false }),
     async(req,res)=>{
     
   
     const id=req.params.id;
     const body=req.body;
     const locateEntry=await blog.findOne({where:{id:id}});
     var token = getToken(req.headers);
 
     if(locateEntry)
     {
        const getEntry=locateEntry.toJSON();
        console.log("bdwBDwo" ,getEntry)
        const getPost=getEntry.post
           
           var setPost=JSON.parse(getPost);
           var addObj={title:body.title,post:body.post}
           setPost.push(addObj)
           setPost=JSON.stringify(setPost)
           blog.update({
            id:id,
            email:getEntry.email,
      
            post:setPost
   
            },{ where: { id:id } }).then(value=>{
           console.log(value)
            }).catch(error=>{
           console.log(error)
           })
     }
     else{
    const locatefromUser=await users.findOne({where:{id:id}});
    const getfromUser=locatefromUser.toJSON();
     const getEmail=getfromUser.email
     var postarray=[];
     var postobj={title:body.title,post:body.post}
     postarray.push(postobj)
     var pusharray=JSON.stringify(postarray)
     blog.create({
         id:id,
         email:getEmail,
   
         post:pusharray

     }).then(value=>{
        console.log(value)
    }).catch(error=>{
        console.log(error)
    })
    

}

    
})

//delete individual blog of user
router.delete('/deleteblog/:id', passport.authenticate("jwt", { session: false }),
    async(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    const locateEntry=await blog.findOne({where:{id:id}});
    const getEntry=locateEntry.toJSON();
    const getPost=getEntry.post
    var setPost=JSON.parse(getPost);
    setPost=setPost.filter((user)=>{
        if(user['title']!=body.title){
            return 1;
        
        }
    })
    setPost=JSON.stringify(setPost)
    blog.update({
        id:id,
        email:getEntry.email,
  
        post:setPost

        },{ where: { id:id } }).then(value=>{
       console.log(value)
        }).catch(error=>{
       console.log(error)
       })
      
    
})

 
//update individual blog of user
router.put('/updateblog/:id', passport.authenticate("jwt", { session: false }),
    async(req,res)=>{
    const id=req.params.id;
    const body=req.body;
    const locateEntry=await blog.findOne({where:{id:id}});
    const getEntry=locateEntry.toJSON();
    const getPost=getEntry.post
    var setPost=JSON.parse(getPost);
    setPost.map((user)=>{
        if(user['title']===body.title){
            user['post']=body.post
        
        }
    })
    setPost=JSON.stringify(setPost)
    blog.update({
        id:id,
        email:getEntry.email,
  
        post:setPost

        },{ where: { id:id } }).then(value=>{
       console.log(value)
        }).catch(error=>{
       console.log(error)
       })


         
})






module.exports= router