const Joi = require("joi");

exports.adminValidation = (data) => {
  const adminSchema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().required().email(),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    password: Joi.string().trim().required().min(5).max(15),
    is_active: Joi.boolean(),
    is_creator: Joi.boolean(),
  });
  return adminSchema.validate(data, { abortEarly: false });
};
