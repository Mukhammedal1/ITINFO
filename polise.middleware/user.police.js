const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).send({ msg: "User ro'yxatdan o'tmagan" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if (bearer !== "Bearer" || !token) {
      return res.status(403).send({ msg: "User ro'yxatdan o'tmagan" });
    }
    const [error, decodedToken] = jwt.verify(
      token,
      config.get("acces_key")
    );
    if (error) {
      return res.status(403).send({ message: error.message });
    }
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(403).send({ message: error.message });
  }
};
