const Joi = require("joi");

exports.descTopicValidation = (data) => {
  const descTopicSchema = Joi.object({
    desc_id: Joi.string().required().alphanum(),
    topic_id: Joi.string().required().alphanum(),
  });

  return descTopicSchema.validate(data, { abortEarly: false });
};
