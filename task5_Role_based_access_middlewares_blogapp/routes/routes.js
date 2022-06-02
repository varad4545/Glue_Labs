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

const loginSignupRoutes=require("./LoginSignupsroutes")
const basicuserRoutes=require("./basicuseroutes")
const adminRoutes=require("./adminroutes")
router.use('/',loginSignupRoutes)
router.use('/',basicuserRoutes)
router.use('/',adminRoutes)

module.exports = router;





