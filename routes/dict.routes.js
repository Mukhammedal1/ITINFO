const {
  addTerm,
  updateTermById,
  getTerm,
  deleteTermById,
  findTermById,
} = require("../controllers/dict.controller");

const router = require("express").Router();

router.get("/all", getTerm);
router.post("/add", addTerm);
router.delete("/:id", deleteTermById);
router.get("/:id", findTermById);
router.put("/:id", updateTermById);

module.exports = router;
