const { errorHandler } = require("../helpers/errorHandler");
const Author = require("../schemas/author");
const mongoose = require("mongoose");
const { authorValidation } = require("../validations/author.valid");
const bcrypt = require("bcrypt");
const config = require("config");
const { authorJwt } = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const hashedPassword = bcrypt.hashSync(value.password, 7);
    const activation_link = uuid.v4();

    const newAuthor = await Author.create({
      ...value,
      password: hashedPassword,
      activation_link,
    });
    await mailService.sendMailActivationCode(
      value.email,
      `${config.get("api_url")}/api/author/activate/${activation_link}`
    );
    res.status(201).send({ message: "New author added", newAuthor });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAuthor = async (req, res) => {
  try {
    // console.log(authorJwt);

    const { email, password } = req.body;
    // console.log(email);
    const author = await Author.findOne({ email });
    // console.log(author);

    if (!author) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(password, author.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.is_active,
    };
    const tokens = authorJwt.generateTokens(payload);
    // console.log(tokens);

    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });
    // try {
    //   setTimeout(() => {
    //     const err = new Error("unCaugthExeption error:");
    //     throw err;
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    // }

    // new Promise((_, reject) => {
    //   reject(new Error("unhandlerRejection example"));
    // });
    // console.log(tokens);
    // const token = jwt.sign(payload, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenTime"),
    // });
    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      author_id: author._id,
      accessToken: tokens.accesToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ msg: "Token topilmadi" });
    }
    const author = await Author.findOne(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!author) {
      return res.status(400).send({ msg: "Bunday tokenli author yo'q" });
    }
    res.clearCookie("refreshToken");
    res.send({
      refreshToken: author.refresh_token,
      msg: "LogOut is succesfully",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ msg: "Cookie Token topilmadi" });
    }
    const [error, tokenFromCookie] = await to(
      authorJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const author = await Author.findOne({ refresh_token: refreshToken });
    if (!author) {
      return res.status(404).send({ msg: "Author not found" });
    }
    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.is_active,
    };
    const tokens = authorJwt.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });
    // console.log(tokens);
    // const token = jwt.sign(payload, config.get("tokenKey"), {
    //   expiresIn: config.get("tokenTime"),
    // });
    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accesToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthors = async (req, res) => {
  try {
    const author = await Author.find({});
    if (!author) {
      return res.status(400).send({ msg: "Avtor topilmadi" });
    }
    res.send(author);
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAuthorById = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body;
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).send({ message: "Bunday author mavjud emas!" });
    }
    const updatedAuthor = await Author.updateOne({ _id: id }, updates);
    res.status(200).send({ message: "Updated successfully", updatedAuthor });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAuthorById = async (req, res) => {
  const id = req.params.id;
  // if (!mongoose.isValidObjectId(id)) {
  //   return res.status(400).send({ message: "ID noto'g'ri" });
  // }
  try {
    const author = await Author.findById(id);
    if (!author) {
      return res.status(404).send({ message: "Bunday author mavjud emas!" });
    }
    const deletedAuthor = await Author.deleteOne({ _id: id });
    return res.send({ msg: "Deleted successfully", deletedAuthor });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAuthorById = async (req, res) => {
  try {
    const id = req.params.id;

    // if (!mongoose.isValidObjectId(id)) {
    //   return res.status(400).send({ message: "ID noto'g'ri" });
    // }
    const author = await Author.findOne({ _id: id });
    if (!author) {
      return res.status(404).send({ message: "Bunday author mavjud emas!" });
    }
    res.send({ author });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateAuthor = async (req, res) => {
  try {
    const link = req.params.link;
    const author = await Author.findOne({ activation_link: link });
    if (!author) {
      return res.status(400).send({ message: "Bunday avtor topilmadi" });
    }
    if (author.is_active) {
      return res.status(400).send({ message: "Avtor avval faollashtirilgan" });
    }

    author.is_active = true;
    await author.save();
    res.send({
      message: "Avtor faollashtirildi",
      is_active: author.is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getAuthors,
  findAuthorById,
  addAuthor,
  updateAuthorById,
  deleteAuthorById,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor,
};
