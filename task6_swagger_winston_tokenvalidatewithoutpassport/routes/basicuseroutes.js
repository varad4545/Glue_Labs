const express = require("express");
const db = require("../config/database");
const users = require("../models/users");
const blog = require("../models/blogpost");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const logger=require('../utils/logger')
const {authRoleLogin,authBasic,authAdminAccess,authToken} = require("../middlewares/authmiddlewares");
require("dotenv").config();
require("../auth/passport");

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
 *  components:
 *    schemas:
 *      postblog: 
 *        type: object
 *        properties: 
 *          title:
 *            type: string
 *          post:
 *            type: string
 */

/**
 * @swagger
 *  components:
 *    schemas:
 *      findblog: 
 *        type: object
 *        properties: 
 *          title:
 *            type: string
 */

/**
 * @swagger
 * /basic/getallblogs/{id}:
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
 * /basic/postblog/{id}:
 *  post:
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
 *            $ref: '#components/schemas/postblog'
 *    responses:
 *      '200':
 *        description: Tech is succesfully updated
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */

/**
 * @swagger
 * /basic/deleteblog/{id}:
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
 *            $ref: '#components/schemas/findblog'
 *    responses:
 *      '200':
 *        description: Tech is succesfully updated
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */

/**
 * @swagger
 * /basic/updateblog/{id}:
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
 *            $ref: '#components/schemas/postblog'
 *    responses:
 *      '200':
 *        description: Tech is succesfully updated
 *        content: 
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#components/schemas/blog'
 */


//get individual blogs
router.get("/basic/getblog/:id",authBasic(),async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const locateEntry = await blog.findOne({ where: { id: id } });
    const getEntry = locateEntry.toJSON();
    const getPost = getEntry.post;
    var setPost = JSON.parse(getPost);
    setPost = setPost.filter((user) => {
      if (user["title"] === body.title) {
        return 1;
      }
    });
    setPost = JSON.stringify(setPost);
    res.send(setPost);
  }
);

//get all blogs of a user
router.get("/basic/getallblogs/:id",authBasic(),async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const locateEntry = await blog.findOne({ where: { id: id } });
    const getEntry = locateEntry.toJSON();
    const getPost = getEntry.post;
    var setPost = JSON.parse(getPost);
    setPost = JSON.stringify(setPost);
    res.send(setPost);
  }
);

//post blogs
router.post("/basic/postblog/:id",authBasic(),async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const locateEntry = await blog.findOne({ where: { id: id } });
    if (locateEntry) {
      const getEntry = locateEntry.toJSON();
      console.log("bdwBDwo", getEntry);
      const getPost = getEntry.post;
      var setPost = JSON.parse(getPost);
      var addObj = { title: body.title, post: body.post };
      setPost.push(addObj);
      setPost = JSON.stringify(setPost);
      blog
        .update(
          {
            id: id,
            email: getEntry.email,
            post: setPost,
          },
          { where: { id: id } }
        )
        .then((value) => {
         res.send("Blog added")
        })
        .catch((error) => {
          logger.customLogger.log('error',"Error: "+err)
        });
    } else {
      const locatefromUser = await users.findOne({ where: { id: id } });
      const getfromUser = locatefromUser.toJSON();
      const getEmail = getfromUser.email;
      var postarray = [];
      var postobj = { title: body.title, post: body.post };
      postarray.push(postobj);
      var pusharray = JSON.stringify(postarray);
      blog
        .create({
          id: id,
          email: getEmail,
          post: pusharray,
        })
        .then((value) => {
          res.send("Blog posted")
        })
        .catch((err) => {
          logger.customLogger.log('error',"Error: "+err)
        });
    }
  }
);

//delete individual blog
router.delete("/basic/deleteblog/:id",authBasic(),async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const locateEntry = await blog.findOne({ where: { id: id } });
    const getEntry = locateEntry.toJSON();
    const getPost = getEntry.post;
    var setPost = JSON.parse(getPost);
    setPost = setPost.filter((user) => {
      if (user["title"] != body.title) {
        return 1;
      }
    });
    setPost = JSON.stringify(setPost);
    blog
      .update(
        {
          id: id,
          email: getEntry.email,
          post: setPost,
        },
        { where: { id: id } }
      )
      .then((value) => {
        res.send("Blog deleted")
      })
      .catch((error) => {
        logger.customLogger.log('error',"Error: "+err)
      });
  }
);

//update individual blog
router.put("/basic/updateblog/:id",authBasic(),async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    const locateEntry = await blog.findOne({ where: { id: id } });
    const getEntry = locateEntry.toJSON();
    const getPost = getEntry.post;
    var setPost = JSON.parse(getPost);
    setPost.map((user) => {
      if (user["title"] === body.title) {
        user["post"] = body.post;
      }
    });
    setPost = JSON.stringify(setPost);
    blog
      .update(
        {
          id: id,
          email: getEntry.email,
          post: setPost,
        },
        { where: { id: id } }
      )
      .then((value) => {
        res.send("Blog updated")
      })
      .catch((err) => {
        logger.customLogger.log('error',"Error: "+err)
      });
  }
);

router.get('/homePage',authToken,(req, res)=>{
  res.send("Welcome to Home Page")
})




module.exports = router;