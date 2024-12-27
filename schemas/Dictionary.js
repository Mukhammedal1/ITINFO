const { Schema, model } = require("mongoose");
const dictSchema = new Schema(
  {
    term: {
      type: String,
      uppercase: true,
      unique: true,
      required: true,
      trim: true,
    },
    letter: { type: String, uppercase: true },
  },
  { versionKey: false }
);

module.exports = model("dictionary", dictSchema);
