const {
  getCategories,
  findCategoryById,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
  findCategoryByName,
} = require("../controllers/category.controller");

const router = require("express").Router();
router.get("/all", getCategories);

router.post("/add", addCategory);
router.delete("/:id", deleteCategoryById);
router.get("/:id", findCategoryById);
router.put("/:id", updateCategoryById);
router.post("/name", findCategoryByName);

module.exports = router;
