const {
  getDescTopics,
  findDescTopicById,
  addDescTopic,
  updateDescTopicById,
  deleteDescTopicById,
} = require("../controllers/desc_topic.controller");

const router = require("express").Router();

router.get("/all", getDescTopics);
router.delete("/:id", deleteDescTopicById);
router.get("/:id", findDescTopicById);
router.post("/add", addDescTopic);
router.put("/:id", updateDescTopicById);

module.exports = router;
