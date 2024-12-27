const { errorHandler } = require("../helpers/errorHandler");
const Admin = require("../schemas/admin");
const mongoose = require("mongoose");
const { adminValidation } = require("../validations/admin.valid");
const bcrypt = require("bcrypt");
const config = require("config");
const { adminJwt } = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");

const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    if (!admins) {
      return res.status(400).send({ msg: "Admins topilmadi" });
    }
    res.send(admins);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    // if (!mongoose.isValidObjectId(id)) {
    //   return res.status(400).send({ message: "ID noto'g'ri" });
    // }
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).send({ message: "Bunday admin mavjud emas!" });
    }
    res.send({ admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    const hashedPassword = bcrypt.hashSync(value.password, 7);
    const newAdmin = await Admin.create({ ...value, password: hashedPassword });
    res.status(201).send({ msg: "New admin added", newAdmin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!email) {
      return res.status(401).send({ msg: "Email yoki Parol noto'g'ri" });
    }
    const isvalidPassword = bcrypt.compareSync(password, admin.password);
    if (!isvalidPassword) {
      return res.status(401).send({ msg: "Email yoki Parol noto'g'ri" });
    }
    const payload = {
      id: admin._id,
      email: admin.email,
      is_creator: admin.is_creator,
      phone: admin.phone,
    };
    const tokens = adminJwt.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });
    res.status(200).send({ msg: "Tizimga xush kelibsiz!", ...tokens });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ msg: "Token topilmadi" });
    }
    const admin = await Admin.findOne(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!admin) {
      return res.status(400).send({ msg: "Bunday tokenli admin yo'q" });
    }
    res.clearCookie("refreshToken");
    res.send({
      refreshToken: admin.refresh_token,
      msg: "LogOut is succesfully",
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshAdminToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    // console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ msg: "Cookie Token topilmadi" });
    }
    const [error, tokenFromCookie] = await to(
      // refresh token yaroqli yoki yaroqsizligini tekshiriladi
      adminJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const admin = await Admin.findOne({ refresh_token: refreshToken });
    if (!admin) {
      return res.status(404).send({ msg: "Admin not found" });
    }
    const payload = {
      id: admin._id,
      email: admin.email,
      is_creator: admin.is_creator,
      phone: admin.phone,
    };
    const tokens = adminJwt.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();
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

const updateAdminById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, password, is_active, is_creator } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).send({ message: "Bunday admin mavjud emas!" });
    }
    const updatedAdmin = await Admin.updateOne(
      { _id: id },
      { name, email, phone, password, is_active, is_creator }
    );
    res.status(200).send({ message: "Updated successfully", updatedAdmin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAdminById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "ID noto'g'ri" });
  }
  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).send({ message: "Bunday admin mavjud emas!" });
    }
    const deletedAdmin = await Admin.deleteOne({ _id: id });
    return res.send({ msg: "Deleted successfully", deletedAdmin });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getAdmins,
  findAdminById,
  addAdmin,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logoutAdmin,
  refreshAdminToken,
};
