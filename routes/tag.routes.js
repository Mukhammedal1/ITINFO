const {
  getTags,
  findTagById,
  addTag,
  updateTagById,
  deleteTagById,
} = require("../controllers/tag.controller");

const router = require("express").Router();

router.get("/all", getTags);
router.delete("/:id", deleteTagById);
router.get("/:id", findTagById);
router.post("/add", addTag);
router.put("/:id", updateTagById);

module.exports = router;
