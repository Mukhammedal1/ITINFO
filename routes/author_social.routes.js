const {
  getAuthorSocials,
  findAuthorSocialById,
  addAuthorSocial,
  updateAuthorSocialById,
  deleteAuthorSocialById,
} = require("../controllers/author_social.controller");

const router = require("express").Router();

router.get("/all", getAuthorSocials);
router.delete("/:id", deleteAuthorSocialById);
router.get("/:id", findAuthorSocialById);
router.post("/add", addAuthorSocial);
router.put("/:id", updateAuthorSocialById);

module.exports = router;
