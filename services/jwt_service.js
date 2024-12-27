const config = require("config");
const jwt = require("jsonwebtoken");
class JwtService {
  constructor(accesKey, refreshKey, accesTime, refreshTime) {
    this.accesKey = accesKey;
    this.refreshKey = refreshKey;
    this.accesTime = accesTime;
    this.refreshTime = refreshTime;
  }
  generateTokens(payload) {
    const accesToken = jwt.sign(payload, this.accesKey, {
      expiresIn: this.accesTime,
    });
    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });
    return {
      accesToken,
      refreshToken,
    };
  }
  async verifyAccesToken(token) {
    return jwt.verify(token, this.accesKey);
  }
  async verifyRefreshToken(token) {
    return jwt.verify(token, this.refreshKey);
  }
}

const authorJwt = new JwtService(
  config.get("author_acces_key"),
  config.get("author_refresh_key"),
  config.get("acces_time"),
  config.get("refresh_time")
);
const adminJwt = new JwtService(
  config.get("admin_acces_key"),
  config.get("admin_refresh_key"),
  config.get("acces_time"),
  config.get("refresh_time")
);
const userJwt = new JwtService(
  config.get("user_acces_key"),
  config.get("user_refresh_key"),
  config.get("acces_time"),
  config.get("refresh_time")
);

module.exports = { authorJwt, adminJwt, userJwt };
