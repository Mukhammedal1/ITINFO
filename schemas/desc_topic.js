const { Schema, model } = require("mongoose");
const desc_topicSchema = new Schema(
  {
    desc_id: { type: Schema.Types.ObjectId, ref: "description" },
    topic_id: { type: Schema.Types.ObjectId, ref: "topic" },
  },
  { versionKey: false }
);

module.exports = model("desc_topic", desc_topicSchema);
