const Joi = require("joi");

exports.descriptionValidation = (data) => {
  const descriptionSchema = Joi.object({
    description: Joi.string().trim().min(30).max(500),
    category_id: Joi.string().required().alphanum(),
  });

  return descriptionSchema.validate(data, { abortEarly: false });
};
