const { Schema, model } = require("mongoose");

const categorySchema = new Schema({
  name: { type: String, required: true },
  parent_cat_id: { type: Schema.Types.ObjectId, ref: "category" },
});

module.exports = model("category", categorySchema);
