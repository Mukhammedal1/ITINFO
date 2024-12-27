const Joi = require("joi");

const first_name = (parent) => {
  return parent.first_name;
};

exports.authorValidation = (data) => {
  const authorSchema = Joi.object({
    first_name: Joi.string().required().trim().min(2).max(30),
    last_name: Joi.string().trim().min(2).max(30),
    nick_name: Joi.string().trim().min(2).max(30).default(first_name),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^\d{2}-\d{3}-\d{2}-\d{2}$/),
    password: Joi.string().trim().min(5).max(15),
    info: Joi.string().required().trim().min(30).max(1000),
    position: Joi.string(),
    photo: Joi.string().trim().default("/author/avatar.png"),
    is_expert: Joi.boolean().default(false),
    is_active: Joi.boolean().default(true),
  });

  return authorSchema.validate(data, { abortEarly: false });
};
