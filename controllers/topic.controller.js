const { errorHandler } = require("../helpers/errorHandler");
const Topic = require("../schemas/topic");
const mongoose = require("mongoose");
const { topicValidation } = require("../validations/topic.valid");

const getTopics = async (req, res) => {
  try {
    const topics = await Topic.find()
      .populate("author_id", "name")
      .populate("expert_id", "name");
    res.send(topics);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const topic = await Topic.findOne({ _id: id })
      .populate("author_id", "name")
      .populate("expert_id", "name");
    if (!topic) {
      return res.status(404).send({ message: "Bunday mavzu mavjud emas!" });
    }
    res.send({ topic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addTopic = async (req, res) => {
  try {
    const { error, value } = topicValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    const newTopic = await Topic.create(value);
    res.status(201).send({ msg: "New topic added", newTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    const { author_id, title, text, is_checked, is_approved, expert_id } =
      req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).send({ message: "Bunday mavzu mavjud emas!" });
    }
    const updatedTopic = await Topic.updateOne(
      { _id: id },
      { author_id, title, text, is_checked, is_approved, expert_id }
    );
    res.status(200).send({ message: "Updated successfully", updatedTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTopicById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "ID noto'g'ri" });
  }
  try {
    const topic = await Topic.findById(id);
    if (!topic) {
      return res.status(404).send({ message: "Bunday mavzu mavjud emas!" });
    }
    const deletedTopic = await Topic.deleteOne({ _id: id });
    return res.send({ msg: "Deleted successfully", deletedTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getTopics,
  findTopicById,
  addTopic,
  updateTopicById,
  deleteTopicById,
};
