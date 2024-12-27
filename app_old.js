const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const winston = require("winston");

const PORT = config.get("port");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./error_middleware/error_handling_middleware");
const logger = require("./services/logger.service");
const expressWinstonError = require("./winston/winston_error_logger");
const expressWinston = require("./winston/express_winston_logger");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});
// console.log(process.env.NODE_ENV);
// console.log(process.env.secret);
// console.log(config.get("secret"));

// process.on("uncaughtException", (exception) => {
//   console.log("uncaughtException", exception.message);
// });
// process.on("unhandledRejection", (rejection) => {
//   console.log("unhandledRejection", rejection);
// });

// logger.log("info", "Log Malumotlari");
// logger.error("Error Malumotlari");
// logger.debug("Debug Malumotlari");
// logger.warn("warn Malumotlari");
// logger.info("info Malumotlari");
// logger.trace("trace Malumotlari");
// logger.table([1, 2, 3]);
// logger.table([
//   ["Sobir", 9],
//   ["Karim", 4],
// ]);

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(expressWinston);

app.use("/api", mainRouter);

app.use(expressWinstonError);

app.use(error_handling_middleware); //error handling eng oxirida chaqiriladi

async function start() {
  try {
    await mongoose.connect(config.get("dbAtlasUri"));
    app.listen(PORT, () => {
      console.log(`Server started at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("DB ga ulanishda xatolik!");
  }
}

start();
