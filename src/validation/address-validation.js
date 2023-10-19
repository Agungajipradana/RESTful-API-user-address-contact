import Joi from "joi";

// Create Address Validation
const createAddressValidation = Joi.object({
  street: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  country: Joi.string().max(100).required(),
  postal_code: Joi.string().max(10).required(),
});

// Get Address Validation
const getAddressValidation = Joi.number().min(1).positive().required();

// Update Address Validation
const updateAddressValidation = Joi.object({
  id: Joi.number().min(1).positive().required(),
  street: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  country: Joi.string().max(100).required(),
  postal_code: Joi.string().max(10).required(),
});

export { createAddressValidation, getAddressValidation, updateAddressValidation };
