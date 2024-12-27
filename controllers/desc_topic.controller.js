const { errorHandler } = require("../helpers/errorHandler");
const DescTopic = require("../schemas/desc_topic");
const mongoose = require("mongoose");
const { descTopicValidation } = require("../validations/desc_topic.valid");

const getDescTopics = async (req, res) => {
  try {
    const descTopics = await DescTopic.find()
      .populate("desc_id", "name")
      .populate("topic_id", "title");
    res.send(descTopics);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findDescTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const descTopic = await DescTopic.findOne({ _id: id })
      .populate("desc_id", "name")
      .populate("topic_id", "title");
    if (!descTopic) {
      return res.status(404).send({ message: "Bunday ma'lumot mavjud emas!" });
    }
    res.send({ descTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addDescTopic = async (req, res) => {
  try {
    const { error, value } = descTopicValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    const newDescTopic = await DescTopic.create(value);
    res.status(201).send({ msg: "New desc_topic added", newDescTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateDescTopicById = async (req, res) => {
  try {
    const id = req.params.id;
    const { desc_id, topic_id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const descTopic = await DescTopic.findById(id);
    if (!descTopic) {
      return res.status(404).send({ message: "Bunday ma'lumot mavjud emas!" });
    }
    const updatedDescTopic = await DescTopic.updateOne(
      { _id: id },
      { desc_id, topic_id }
    );
    res.status(200).send({ message: "Updated successfully", updatedDescTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteDescTopicById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "ID noto'g'ri" });
  }
  try {
    const descTopic = await DescTopic.findById(id);
    if (!descTopic) {
      return res.status(404).send({ message: "Bunday ma'lumot mavjud emas!" });
    }
    const deletedDescTopic = await DescTopic.deleteOne({ _id: id });
    return res.send({ msg: "Deleted successfully", deletedDescTopic });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getDescTopics,
  findDescTopicById,
  addDescTopic,
  updateDescTopicById,
  deleteDescTopicById,
};
