const Joi = require('joi');

// Validation schema for creating and updating tasks
const createTaskSchema = Joi.object({
  title: Joi.string().required().trim(),
  description: Joi.string().required().trim(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done').default('To Do'),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().trim(),
  description: Joi.string().trim(),
  status: Joi.string().valid('To Do', 'In Progress', 'Done'),
  arrIdx: Joi.number().integer(),
}).min(1); // At least one field must be provided

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};
