const Joi = require("joi");

exports.userValidation = (data) => {
  const userSchema = Joi.object({
    name: Joi.string().required().trim().uppercase(),
    email: Joi.string().required().email(),
    password: Joi.string().trim().min(5).max(15),
    info: Joi.string().max(50),
    photo: Joi.string(),
    is_active: Joi.boolean(),
  });
  return userSchema.validate(data, { abortEarly: false });
};
