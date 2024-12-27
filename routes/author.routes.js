const {
  getAuthors,
  findAuthorById,
  addAuthor,
  updateAuthorById,
  deleteAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor,
} = require("../controllers/author.controller");
const authorPolice = require("../polise.middleware/author.police");
const author_creatorPolice = require("../polise.middleware/author_creator.police");
const author_selfGuard = require("../polise.middleware/author_self.guard");

const router = require("express").Router();

router.post("/login", loginAuthor);

router.get("/all", authorPolice,getAuthors);
router.get("/activate/:link", activateAuthor);
router.post("/add", addAuthor);
router.post("/logout", logoutAuthor);
router.post("/refresh", refreshAuthorToken);
router.delete("/:id", deleteAuthorById);
router.get("/:id", authorPolice, author_selfGuard, findAuthorById);
router.put("/:id", authorPolice, author_selfGuard, updateAuthorById);

module.exports = router;
