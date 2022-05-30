const express=require('express')
const db = require('../config/database');
const usermodel = require('../models/usermodel');
const router=express.Router();

//get method
router.get("/",(req,res)=>
{

    usermodel.findAll().
    then(
        users=>{
            console.log(users);
            res.send(users)
        }
    )
    .catch(
        err=>console.log(err)
    )
    
})

//post method
router.post('/',(req,res)=>
{
    const body=req.body;
    console.log(body)
    usermodel.create({
        id:body.id,
        name:body.name,
        email:body.email,
        phonenumber:body.phonenumber,

    }).then(value=>{
        console.log(value)
    }).catch(error=>{
        console.log(error)
    })
})

//delete method
router.delete('/:id',(req,res)=>
{
    usermodel.destroy({
        where: { id: req.params.id },
      })
      .then(() =>
      {
        res.send("Item deleted");
      })
      .catch((err) =>
      {
        console.log("Error: "+err);
      });
})

//Update method
router.put("/:id", (req, res) =>
{
    const body=req.body;
    const  entry = {
      id:body.id,
      name:body.name,
      email:body.id,
      phonenumber:body.phonenumber,

    };
    usermodel.update(entry, { where: { id: req.params.id } })
      .then(() => 
      {
        res.send("Item Updated");
      })
      .catch((error) => 
      {
        console.log(error);
      });
  });

module.exports= router