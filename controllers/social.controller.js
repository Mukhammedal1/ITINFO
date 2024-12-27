const { errorHandler } = require("../helpers/errorHandler");
const Social = require("../schemas/social");
const mongoose = require("mongoose");
const { socialValidation } = require("../validations/social.valid");

const getSocials = async (req, res) => {
  try {
    const socials = await Social.find();
    res.send(socials);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const social = await Social.findOne({ _id: id });
    if (!social) {
      return res.status(404).send({ message: "Bunday social mavjud emas!" });
    }
    res.send({ social });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addSocial = async (req, res) => {
  try {
    const { error, value } = socialValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    const oldSocial = await Social.findOne({ name: value.name });
    if (oldSocial) {
      return res.status(400).send({ msg: "This social already exists" });
    }
    const newSocial = await Social.create(value);
    res.status(201).send({ msg: "New social added", newSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, icon_file } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const social = await Social.findById(id);
    if (!social) {
      return res.status(404).send({ message: "Bunday social mavjud emas!" });
    }
    const updatedSocial = await Social.updateOne(
      { _id: id },
      { name, icon_file }
    );
    res.status(200).send({ message: "Updated successfully", updatedSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteSocialById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "ID noto'g'ri" });
  }
  try {
    const social = await Social.findById(id);
    if (!social) {
      return res.status(404).send({ message: "Bunday social mavjud emas!" });
    }
    const deletedSocial = await Social.deleteOne({ _id: id });
    return res.send({ msg: "Deleted successfully", deletedSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getSocials,
  findSocialById,
  addSocial,
  updateSocialById,
  deleteSocialById,
};
