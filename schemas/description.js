const { Schema, model } = require("mongoose");

const descriptionSchema = new Schema({
  description: { type: String, required: true },
  category_id: { type: Schema.Types.ObjectId, ref: "category" },
});

module.exports = model("description", descriptionSchema);
