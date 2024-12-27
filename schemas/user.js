const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    info: { type: String },
    photo: { type: String },
    is_active: { type: Boolean, default: false },
    refresh_token: { type: String },
    activation_link: { type: String },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("user", userSchema);
