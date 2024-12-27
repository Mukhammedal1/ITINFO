const {
  getUsers,
  findUserById,
  addUser,
  updateUserById,
  deleteUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
  activateUser,
} = require("../controllers/user.controller");
const userPolice = require("../polise.middleware/user.police");
const user_creatorPolice = require("../polise.middleware/user_creator.police");
const user_selfGuard = require("../polise.middleware/user_self.guard");

const router = require("express").Router();

router.get("/all", userPolice, getUsers);
router.get("/activate/:link", activateUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshUserToken);
router.delete("/:id", deleteUserById);
router.get("/:id", userPolice, user_selfGuard, findUserById);
router.post("/add", addUser);
router.put("/:id", userPolice, user_selfGuard, updateUserById);

module.exports = router;
