import express from 'express'
import {v4 as uuidv4} from 'uuid'
const router=express.Router();

let users=[

]
// get all
// In POSTMAN Select GET and paste the link http://localhost:5000/users/
router.get("/",(req,res)=>{
    res.send(users)
})
//Post new data
// In POSTMAN Select POST and paste the link http://localhost:5000/users/
//id can be accesed from json body output
router.post('/',(req,res)=>{
    const user=req.body;
    const id1=uuidv4();
    user.id=id1;
    users.push(user)
     res.send("A new user is added")
})
//get individual elements
// In POSTMAN Select GET and paste the link http://localhost:5000/users/id
//id can be accesed from json body output
router.get('/:id',(req,res)=>{
    const id=req.params.id;
    const target=users.find((user)=>user.id==id);
    res.send(target)
})
// deleting elements using id at the end of link
// In POSTMAN Select DELETE and paste the link http://localhost:5000/users/id
//id can be accesed from json body output
router.delete('/:id',(req,res)=>{
    const id=req.params.id;
    users=users.filter((user)=>user.id!=id);
    res.send("A user was deleted")
})

// Updating elements using id at the end of link
// In POSTMAN Select PUT and paste the link http://localhost:5000/users/id
//id can be accesed from json body output
router.put('/:id',(req,res)=>{
   const id=req.params.id;
   const bodydata=req.body
   console.log(req.body)
   console.log(bodydata)
   const target=users.find((user)=>user.id==id);
   if(bodydata.name){target.name=bodydata.name;}
   if(bodydata.email){target.email=bodydata.email;}
   if(bodydata.phonenumber){target.phonenumber=bodydata.phonenumber}

   res.send("User updated")

})



export default router