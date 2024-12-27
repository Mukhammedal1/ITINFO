const Joi = require("joi");

exports.authorSocialValidation = (data) => {
  const authorSocialSchema = Joi.object({
    author_id: Joi.string().required().trim().alphanum(),
    social_id: Joi.string().required().trim().alphanum(),
    social_link: Joi.string().required().trim(),
  });

  return authorSocialSchema.validate(data, { abortEarly: false });
};
