
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const routes=require('./routes/routes')
const passport=require('passport')
const session=require('express-session')
require('./passport')
const db = require('./config/database');

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
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session());
app.use("/",routes)
app.listen(5002, () => console.log(`Example app listening on port ${5002}!`))

