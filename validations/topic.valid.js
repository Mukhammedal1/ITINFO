const Joi = require("joi");

exports.topicValidation = (data) => {
  const topicSchema = Joi.object({
    author_id: Joi.string().required().alphanum(),
    title: Joi.string().required().trim().max(100),
    text: Joi.string().required().trim().min(20).max(5000),
    is_checked: Joi.boolean().default(false),
    is_approved: Joi.boolean().default(false),
    expert_id: Joi.string()
  });

  return topicSchema.validate(data, { abortEarly: false });
};
