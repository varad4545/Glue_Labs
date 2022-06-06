const express = require("express");
const db = require("../config/database");
const users = require("../models/users");
const blog = require("../models/blogpost");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();
require("../auth/passport");

const loginSignupRoutes=require("./public/HomeLoginSignupsroutes")
const basicuserRoutes=require("./protected/basicuseroutes")
const adminRoutes=require("./protected/adminroutes")
router.use('/',loginSignupRoutes)
router.use('/',basicuserRoutes)
router.use('/',adminRoutes)

module.exports = router;





