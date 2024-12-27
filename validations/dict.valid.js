const Joi = require("joi");

exports.dictionaryValidation = (data) => {
  const dictSchema = Joi.object({
    term: Joi.string().uppercase().required().trim(),
    letter: Joi.string().uppercase()
  });

  return dictSchema.validate(data, { abortEarly: false });
};
