const { Schema, model } = require("mongoose");
const socialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    icon_file: { type: String },
  },
  { versionKey: false }
);

module.exports = model("social", socialSchema);
