const {
  getSocials,
  findSocialById,
  addSocial,
  updateSocialById,
  deleteSocialById,
} = require("../controllers/social.controller");

const router = require("express").Router();

router.get("/all", getSocials);
router.delete("/:id", deleteSocialById);
router.get("/:id", findSocialById);
router.post("/add", addSocial);
router.put("/:id", updateSocialById);

module.exports = router;
