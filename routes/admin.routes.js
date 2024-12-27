const {
  getAdmins,
  findAdminById,
  addAdmin,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
} = require("../controllers/admin.controller");
const adminPolice = require("../polise.middleware/admin.police");
const admin_creatorPolice = require("../polise.middleware/admin_creator.police");
const admin_selfGuard = require("../polise.middleware/admin_self.guard");

const router = require("express").Router();

router.get("/all", adminPolice, admin_selfGuard, getAdmins);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refresh", refreshAdminToken);
router.get("/:id", adminPolice, admin_selfGuard, findAdminById);
router.delete("/:id", adminPolice, admin_selfGuard, deleteAdminById);
router.post("/add", addAdmin);
router.put("/:id", updateAdminById);

module.exports = router;
