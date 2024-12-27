const { to } = require("../helpers/to_promise");
const {adminJwt} = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    // console.log(authorization);
    if (!authorization) {
      return res.status(403).send({ msg: "Admin ro'yxatdan o'tmagan" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if (bearer !== "Bearer" || !token) {
      return res.status(403).send({ msg: "Admin ro'yxatdan o'tmagan" });
    }
    const [error, decodedToken] = await to(adminJwt.verifyAccesToken(token));
    if (error) {
      return res.status(403).send({ message: error.message });
    }
    // console.log(decodedToken);
    req.admin = decodedToken;
    next();
  } catch (error) {
    // console.log(error);
    return res.status(403).send({ message: error.message });
  }
};
