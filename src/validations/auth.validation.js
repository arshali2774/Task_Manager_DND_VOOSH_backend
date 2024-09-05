const Joi = require('joi');
// validation schema for register route
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(30).required(),
  lastName: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
// validation schema for login route
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
