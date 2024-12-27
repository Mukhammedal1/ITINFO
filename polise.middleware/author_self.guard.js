
const { to } = require("../helpers/to_promise");
const {authorJwt} = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  try {
    const id = req.params.id;
    if (id !== req.author.id) {
      return res.status(403).send({ msg: "Sizda bunday huquq yo'q" });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: error.message });
  }
};
