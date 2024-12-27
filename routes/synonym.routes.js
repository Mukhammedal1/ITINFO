const {
  getSynonyms,
  findSynonymById,
  addSynonym,
  updateSynonymById,
  deleteSynonymById,
} = require("../controllers/synonym.controller");

const router = require("express").Router();

router.get("/all", getSynonyms);
router.delete("/:id", deleteSynonymById);
router.get("/:id", findSynonymById);
router.post("/add", addSynonym);
router.put("/:id", updateSynonymById);

module.exports = router;
