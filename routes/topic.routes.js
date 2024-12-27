const {
  getTopics,
  findTopicById,
  addTopic,
  updateTopicById,
  deleteTopicById,
} = require("../controllers/topic.controller");

const router = require("express").Router();

router.get("/all", getTopics);
router.delete("/:id", deleteTopicById);
router.get("/:id", findTopicById);
router.post("/add", addTopic);
router.put("/:id", updateTopicById);

module.exports = router;
