const { Schema, model } = require("mongoose");

const adminSchema = new Schema(
  {
    name: { type: String, uppercase: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Iltimos emailni to'gri kiriting",
      ],
    },
    phone: { type: String, required: true },
    password: {
      type: String,
      required: true,
      minlength: [5, "parol 5 ta belgidan ko'p bo'lishi kerak"],
    },
    is_active: { type: Boolean, default: false },
    is_creator: { type: Boolean, default: false },
    refresh_token: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("admin", adminSchema);
