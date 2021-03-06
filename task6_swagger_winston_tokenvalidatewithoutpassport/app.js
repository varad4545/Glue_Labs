const express=require('express')
const bodyParser=require('body-parser')
const routes=require('./routes/routes')
const app=express()
const logger=require('./utils/logger')
const swaggerJsDocs=require('swagger-jsdoc')
const swaggerUi=require('swagger-ui-express');
require("dotenv").config();
require('./auth/passport')
require('./config/database');
const swaggerOptions=require("./swagger/swaggerOptions")
const swaggerDocs=swaggerJsDocs(swaggerOptions);
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocs))
app.use(bodyParser.json())
app.use("/",routes)
app.listen
(
    5000,()=>{ 
        logger.customLogger.log('info',"Server Started")}
)