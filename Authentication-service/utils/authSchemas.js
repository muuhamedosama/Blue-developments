const Joi = require('joi');

const schemas = { 
  signup: Joi.object().keys({ 
    username: Joi.string().required(),
    password: Joi.string().required().min(6),
  }),  
  login: Joi.object().keys({ 
    username: Joi.string().required(),
    password: Joi.string().required(),
  })
  
}; 
module.exports = schemas;