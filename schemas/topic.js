const { Schema, model } = require("mongoose");
const topicSchema = new Schema(
  {
    author_id: { type: Schema.Types.ObjectId, ref: "author" },
    title: { type: String },
    text: {
      type: String,
      maxLength: [1000, "text 1000 ta belgidan kam bo'lishi kerak"],
    },
    is_checked: { type: Boolean },
    is_approved: { type: Boolean },
    expert_id: { type: Schema.Types.ObjectId, ref: "author" },
  },
  { versionKey: false, 
    timestamps: true }
);

module.exports = model("topic", topicSchema);
