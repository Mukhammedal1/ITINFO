const Joi = require("joi");

exports.categoryValidations = (data) => {
  const categorySchema = Joi.object({
    name: Joi.string()
      .min(3)
      .message("Kategoriya nomi 3 ta harfdan uzun bo'lishi kerak")
      .max(50)
      .message("Kategoriya nomi 50 ta harfdan kam bo'lishi kerak")
      .required()
      .messages({
        "string.empty": "Kategoriya nomi bo'sh bo'lishi mumkin emas",
        "any.required": "Kategoriya nomi kiritilishi shart",
      }),
    parent_cat_id: Joi.string().alphanum().message("ID noto'g'ri"),
  });

  return categorySchema.validate(data);
};
