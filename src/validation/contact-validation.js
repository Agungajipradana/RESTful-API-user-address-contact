import Joi from "joi";

// Create Contact
const createContactValidation = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).optional(),
  email: Joi.string().max(200).email().optional(),
  phone: Joi.string().max(200).optional(),
});

// Get Contact
const getContactValidation = Joi.number().positive().required();

// Update Contact
const updateContactValidation = Joi.object({
  id: Joi.number().positive().required(),
  first_name: Joi.string().max(100).required(),
  last_name: Joi.string().max(100).optional(),
  email: Joi.string().max(200).email().optional(),
  phone: Joi.string().max(200).optional(),
});

export { createContactValidation, getContactValidation, updateContactValidation };
