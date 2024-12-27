const ApiError = require("../errors/ApiError");
const logger = require("../services/logger.service");

module.exports = function (err,req, res, next) {
  logger.error(err)
  if (err instanceof ApiError) {
    return res.status(err.status).send({ msg: err.message });
  }
  if (err instanceof SyntaxError) {
    return res.status(err.status).send({ msg: err.message });
  }
  return res.status(500).send({ msg: "Nazarda tutilmagan xatolik!" });
};
