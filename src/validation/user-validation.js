import Joi from "joi";

// Register User Validation
const registerUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
  name: Joi.string().max(100).required(),
});

// Login User Validation
const loginUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).required(),
});

// Get User Validation
const getUserValidation = Joi.string().max(100).required();

// Update User Validation
const updateUserValidation = Joi.object({
  username: Joi.string().max(100).required(),
  password: Joi.string().max(100).optional(),
  name: Joi.string().max(100).optional(),
});

export { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation };
