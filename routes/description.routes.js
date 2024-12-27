const {
  getDescriptions,
  findDescriptionById,
  addDescription,
  updateDescriptionById,
  deleteDescriptionById,
} = require("../controllers/description.controller");

const router = require("express").Router();

router.get("/all", getDescriptions);
router.post("/add", addDescription);
router.delete("/:id", deleteDescriptionById);
router.get("/:id", findDescriptionById);
router.put("/:id", updateDescriptionById);

module.exports = router;
