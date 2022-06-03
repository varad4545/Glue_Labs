const express = require("express");
const db = require("../config/database");
const users = require("../models/users");
const blog = require("../models/blogpost");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {authRoleLogin,authBasic,authAdminAccess} = require("../middlewares/authmiddlewares");
const logger=require('../utils/logger')
require("dotenv").config();
require("../auth/passport");
const swaggerUi=require('swagger-ui-express');
const swaggerJsDocs=require('swagger-jsdoc')


/**
 * @swagger
 *  components:
 *    schemas:
 *      User: 
 *        type: object
 *        properties: 
 *          id:
 *            type: number
 *          email:
 *            type: string
 *          password:
 *            type: string   
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      blog: 
 *        type: object
 *        properties: 
 *          id:
 *            type: number
 *          email:
 *            type: string
 *          post:
 *            type: string     
 */


/**
 * @swagger
 * /admin/getusers/{id}:
 *   get:
 *     summary: Returns the list of all basic users
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *     responses:
 *       200:
 *         description: The list of the basic users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       404:
 *         description: The users were not found
 */

/**
 * @swagger
 * /admin/getblogs/{id}:
 *   get:
 *     summary: Returns the list of all basic users
 *     parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: number
 *        description: Numeric ID required
 *     responses:
 *       200:
 *         description: The list of the basic users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/blog'
 *       404:
 *         description: The users were not found
 */

/**
 * @swagger
 * /admin/deleteusers/{id}:
 *  delete:
 *    description: Use to update user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema: 
 *          type: number
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: Tech is succesfully updated
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 */

/**
 * @swagger
 * /admin/updateusers/{id}:
 *  put:
 *    description: Use to update user
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        description: Numeric ID required
 *        schema: 
 *          type: number
 *    requestBody: 
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#components/schemas/User'
 *    responses:
 *      '200':
 *        description: Tech is succesfully updated
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/User'
 */


//get all users
router.get("/admin/getusers/:id", authAdminAccess(), async (req, res) => {
  const getusers = await users.findAll({ where: { role: "basic" } });
  if (getusers) {
    const getuserlist = JSON.stringify(getusers);
    res.send(getusers);
  } else {
    res.send("No users");
  }
});

//get all blogs
router.get("/admin/getblogs/:id", authAdminAccess(), async (req, res) => {
  const getusers = await blog.findAll();
  if (getusers) {
    const getuserlist = JSON.stringify(getusers);
    res.send(getusers);
  } else {
    res.send("No users");
  }
});

//delete individual users
router.delete("/admin/deleteusers/:id", authAdminAccess(), async (req, res) => {
  const deleteid = req.body.id;
  var finduser = await users.findOne({ where: { id: deleteid } });
  if (finduser) {
    finduser = finduser.toJSON();
    if (finduser.role === "admin") {
      res.send("Other Admins cannot be deleted");
    } else {
      users
        .destroy({ where: { id: deleteid } })
        .then((data) => {
          res.send("User deleted");
        })
        .catch((err) => {
          
          logger.customLogger.log('error',"Error: "+err)
        });

      blog
        .destroy({ where: { id: deleteid } })
        .then((data) => {
          res.send("BLog entry deleted");
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
    }
  } else {
    res.send("User not found");
  }
});

//update individual users
router.put("/admin/updateusers/:id", authAdminAccess(), async (req, res) => {
  updateid = req.body.id;
  var finduser = await users.findOne({ where: { id: updateid } });
  if (finduser) {
    finduser = finduser.toJSON();
    if (finduser.role === "admin") {
      res.send("Other Admins cannot be updated");
    } else {
      const updatedData = {
        id: updateid,
        email: req.body.email,
      };
      users
        .update(updatedData, { where: { id: updateid } })
        .then((data) => {
          res.send("Updated User");
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
      blog
        .update(updatedData, { where: { id: updateid } })
        .then((data) => {
          res.send("Updated Blog");
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
    }
  } else {
    res.send("User not found");
  }
});

module.exports = router;
