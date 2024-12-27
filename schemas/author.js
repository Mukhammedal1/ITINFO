const { Schema, model } = require("mongoose");
const authorSchema = new Schema(
  {
    first_name: { type: String, reuqired: true, trim: true, uppercase: true },
    last_name: { type: String, reuqired: true, trim: true, uppercase: true },
    nick_name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Iltimos emailni to'gri kiriting",
      ],
    },
    phone: {
      type: String,
      validate: {
        validator: function (value) {
          return /^\d{2}-\d{3}-\d{2}-\d{2}$/.test(value);
        },
        message: (props) => `${props.value} - raqam noto'g'ri`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [5, "Parol 5 ta blegindan ko'p bo'lishi kerak"],
    },
    info: { type: String },
    position: { type: String },
    photo: { type: String },
    is_expert: { type: Boolean, default: false },
    is_active: { type: Boolean, default: false },
    refresh_token: { type: String },
    activation_link: { type: String },
  },
  { versionKey: false }
);

module.exports = model("author", authorSchema);
