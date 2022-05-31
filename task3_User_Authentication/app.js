const express=require('express')
const bodyParser=require('body-parser')
const routes=require('./routes/routes')
const db = require('./config/database');
const app=express()
require('./auth/passport')
db.authenticate().
then
(
    ()=>
    {
        console.log("Database connected...")
    }
)
.catch
(
    err=>
    {
        console.log("Error: "+err)
    }
)
app.use(bodyParser.json())
app.use("/",routes)
app.listen
(
    5000,()=>{console.log("Server Started")}
)