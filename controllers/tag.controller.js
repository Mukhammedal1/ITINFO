const { errorHandler } = require("../helpers/errorHandler");
const Tag = require("../schemas/tag");
const mongoose = require("mongoose");
const { tagValidation } = require("../validations/tag.valid");

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate("topic_id", "title")
      .populate("category_id", "name");
    res.send(tags);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findTagById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const tag = await Tag.findOne({ _id: id })
      .populate("topic_id", "title")
      .populate("category_id", "name");
    if (!tag) {
      return res.status(404).send({ message: "Bunday teg mavjud emas!" });
    }
    res.send({ tag });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addTag = async (req, res) => {
  try {
    const { error, value } = tagValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    const newTag = await Tag.create(value);
    res.status(201).send({ msg: "New tag added", newTag });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTagById = async (req, res) => {
  try {
    const id = req.params.id;
    const { topic_id, category_id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).send({ message: "Bunday teg mavjud emas!" });
    }
    const updatedTag = await Tag.updateOne(
      { _id: id },
      { topic_id, category_id }
    );
    res.status(200).send({ message: "Updated successfully", updatedTag });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTagById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "ID noto'g'ri" });
  }
  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).send({ message: "Bunday teg mavjud emas!" });
    }
    const deletedTag = await Tag.deleteOne({ _id: id });
    return res.send({ msg: "Deleted successfully", deletedTag });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getTags,
  findTagById,
  addTag,
  updateTagById,
  deleteTagById,
};
