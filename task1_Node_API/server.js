import express from 'express'
import bodyParser from "body-parser";
import routes from "./routes/users.js"
const app=express()

app.use(bodyParser.json())
app.use("/users",routes)
app.listen(5000,()=>console.log("Server Started"))