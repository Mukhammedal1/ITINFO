const { errorHandler } = require("../helpers/errorHandler");
const AuthorSocial = require("../schemas/author_social");
const mongoose = require("mongoose");
const {
  authorSocialValidation,
} = require("../validations/author_social.valid");

const getAuthorSocials = async (req, res) => {
  try {
    const authorSocials = await AuthorSocial.find()
      .populate("author_id", "name")
      .populate("social_id", "name");
    res.send(authorSocials);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findAuthorSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const authorSocial = await AuthorSocial.findOne({ _id: id })
      .populate("author_id", "name")
      .populate("social_id", "name");
    if (!authorSocial) {
      return res.status(404).send({ message: "Bunday ma'lumot mavjud emas!" });
    }
    res.send({ authorSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addAuthorSocial = async (req, res) => {
  try {
    const { error, value } = authorSocialValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    const newAuthorSocial = await AuthorSocial.create(value);
    res.status(201).send({ msg: "New author social added", newAuthorSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAuthorSocialById = async (req, res) => {
  try {
    const id = req.params.id;
    const { author_id, social_id, social_link } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const authorSocial = await AuthorSocial.findById(id);
    if (!authorSocial) {
      return res.status(404).send({ message: "Bunday ma'lumot mavjud emas!" });
    }
    const updatedAuthorSocial = await AuthorSocial.updateOne(
      { _id: id },
      { author_id, social_id, social_link }
    );
    res.status(200).send({
      message: "Updated successfully",
      updatedAuthorSocial,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAuthorSocialById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "ID noto'g'ri" });
  }
  try {
    const authorSocial = await AuthorSocial.findById(id);
    if (!authorSocial) {
      return res.status(404).send({ message: "Bunday ma'lumot mavjud emas!" });
    }
    const deletedAuthorSocial = await AuthorSocial.deleteOne({ _id: id });
    return res.send({ msg: "Deleted successfully", deletedAuthorSocial });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getAuthorSocials,
  findAuthorSocialById,
  addAuthorSocial,
  updateAuthorSocialById,
  deleteAuthorSocialById,
};
