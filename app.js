const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const PORT = config.get("port");
const mainRouter = require("./routes/index.routes");
const error_handling_middleware = require("./error_middleware/error_handling_middleware");
const exHbs = require("express-handlebars");
const viewRouter = require("./routes/view.routes");

const hbs = exHbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.engine("hbs", hbs.engine);
app.set("view-engine", "hbs");
app.set("views", "./views");
app.use(express.static("views"));

app.use("/", viewRouter);
app.use("/api", mainRouter);

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

// mongodb+srv://superadmin:adminjon12345@database.x7rxa.mongodb.net/?retryWrites=true&w=majority&appName=Database
