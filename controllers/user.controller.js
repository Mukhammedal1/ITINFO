const User = require("../schemas/user");
const mongoose = require("mongoose");
const { errorHandler } = require("../helpers/errorHandler");
const { userValidation } = require("../validations/user.valid");
const bcrypt = require("bcrypt");
const config = require("config");
const { userJwt } = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");
const uuid = require("uuid");
const mailService = require("../services/mail.service");

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).send({ msg: "Users topilmadi" });
    }
    res.status(200).send(users);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }
    res.status(200).send(user);
  } catch (error) {
    errorHandler(error, res);
  }
};

const addUser = async (req, res) => {
  try {
    const { error, value } = userValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    const hashedPassword = bcrypt.hashSync(value.password, 10);
    const activation_link = uuid.v4();
    const newUser = await User.create({
      ...value,
      password: hashedPassword,
      activation_link,
    });
    await mailService.sendMailActivationCode(
      value.email,
      `${config.get("api_url")}/api/user/activate/${activation_link}`
    );
    res.status(201).send({ message: "Yangi foydalanuvchi qo'shildi", newUser });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ msg: "Email yoki parol noto'g'ri" });
    }
    const isvalidPassword = bcrypt.compareSync(password, user.password);
    if (!isvalidPassword) {
      return res.status(400).send({ msg: "Email yoki parol noto'g'ri" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
    };
    const tokens = userJwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });
    res.status(200).send({ msg: "Tizimga xush kelibsiz!", ...tokens });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutUser = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ msg: "Token topilmadi" });
    }
    const user = await User.findOne(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!user) {
      return res.status(400).send({ msg: "Bunday tokenli user yo'q" });
    }
    res.clearCookie("refreshToken");
    res.send({
      refreshToken: user.refresh_token,
      msg: "LogOut is succesfully",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshUserToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ msg: "Cookie Token topilmadi" });
    }
    const [error, tokenFromCookie] = await to(
      userJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const user = await User.findOne({ refresh_token: refreshToken });
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    const payload = {
      id: user._id,
      email: user.email,
      is_active: user.is_active,
    };
    const tokens = userJwt.generateTokens(payload);
    user.refresh_token = tokens.refreshToken;
    await user.save();
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

const updateUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, info, photo, is_active } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }
    const updatedUser = await User.updateOne(
      { _id: id },
      { name, email, password, info, photo, is_active }
    );
    res.status(200).send({ message: "Foydalanuvchi yangilandi", updatedUser });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteUserById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Foydalanuvchi topilmadi" });
    }
    const deletedUser = await User.deleteOne({ _id: id });
    res.status(200).send({ message: "Foydalanuvchi o'chirildi", deletedUser });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateUser = async (req, res) => {
  try {
    const link = req.params.link;
    const user = await User.findOne({ activation_link: link });
    if (!user) {
      return res.status(400).send({ message: "Bunday user topilmadi" });
    }
    if (user.is_active) {
      return res.status(400).send({ message: "User avval faollashtirilgan" });
    }

    user.is_active = true;
    await user.save();
    res.send({
      message: "User faollashtirildi",
      is_active: user.is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getUsers,
  findUserById,
  addUser,
  updateUserById,
  deleteUserById,
  loginUser,
  logoutUser,
  refreshUserToken,
  activateUser,
};
