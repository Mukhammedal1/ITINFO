const { Schema, model } = require("mongoose");
const author_socialSchema = new Schema(
  {
    author_id: { type: Schema.Types.ObjectId, ref: "author" },
    social_id: { type: Schema.Types.ObjectId, ref: "social" },
    social_link: { type: String },
  },
  { versionKey: false }
);

module.exports = model("author_social", author_socialSchema);
