const router = require("express").Router();

const dictRoute = require("./dict.routes");
const categoryRoute = require("./category.routes");
const descriptionRoute = require("./description.routes");
const synonymRoute = require("./synonym.routes");
const authorRoute = require("./author.routes");
const socialRoute = require("./social.routes");
const author_socialRoute = require("./author_social.routes");
const topicRoute = require("./topic.routes");
const desc_topicRoute = require("./desc_topic.routes");
const tagRoute = require("./tag.routes");
const adminRoute = require("./admin.routes");
const userRoute = require("./user.routes");

router.use("/dict", dictRoute);
router.use("/category", categoryRoute);
router.use("/description", descriptionRoute);
router.use("/synonym", synonymRoute);
router.use("/author", authorRoute);
router.use("/social", socialRoute);
router.use("/author_social", author_socialRoute);
router.use("/topic", topicRoute);
router.use("/desc_topic", desc_topicRoute);
router.use("/tag", tagRoute);
router.use("/admin", adminRoute);
router.use("/user", userRoute);

module.exports = router;
