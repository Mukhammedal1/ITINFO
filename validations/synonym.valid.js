const Joi = require("joi");

exports.synonymValidation = (data) => {
  const synonymSchema = Joi.object({
    desc_id: Joi.string().required().alphanum(),
    dict_id: Joi.string().required().alphanum(),
  });

  return synonymSchema.validate(data, { abortEarly: false });
};
