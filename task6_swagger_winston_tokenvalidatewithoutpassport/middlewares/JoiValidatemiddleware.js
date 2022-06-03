var Joi=require('joi');
function validateUser(req,res,next)
{
    const schema=Joi.object().keys({
         id:Joi.number().integer().required(),
         email:Joi.string().email().required(),
         password:Joi.string().required()
    })
    console.log(req.body)
    const {error}=schema.validate(req.body);
    if(error){
      res.status(200).json({error:error})
    }
    else{
      next()
    }

}
module.exports={validateUser}