const Joi = require('joi');

const schemas = { 
  createdTask: Joi.object().keys({ 
    taskName: Joi.string().required(),
    description: Joi.any(),
    dueDate: Joi.date(),
  }),  
  patchTask: Joi.object().keys({ 
    isCompleted: Joi.boolean().required(),
  }),
  updateTask: Joi.object().keys({ 
    taskName: Joi.string().required(),
    description: Joi.any(),
    dueDate: Joi.date(),
  })
}; 

module.exports = schemas;