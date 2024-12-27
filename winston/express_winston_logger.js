const winston = require("winston");
const expressWinston = require("express-winston");

module.exports = expressWinston.logger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  ignoreRoute: function (req, res) {
    return false;
  },
});
