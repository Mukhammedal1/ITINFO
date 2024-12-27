const { errorHandler } = require("../helpers/errorHandler");
const Dictionary = require("../schemas/Dictionary");
const mongoose = require("mongoose");
const { dictionaryValidation } = require("../validations/dict.valid");

const getTerm = async (req, res) => {
  try {
    const terms = await Dictionary.find();
    res.send(terms);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findTermById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const termOne = await Dictionary.findOne({ _id: id });
    if (!termOne) {
      return res.status(400).send({ message: "Bunday term mavjud emas!" });
    }
    res.send({ termOne });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addTerm = async (req, res) => {
  try {
    const { error,value } = dictionaryValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    const oldTerm = await Dictionary.findOne({term:value.term});
    if (oldTerm) {
      return res.status(400).send({ msg: "This term already exists" });
    }
    const newTerm = await Dictionary.create({...value, letter:(value.term)[0]});
    res.status(201).send({ msg: "New term added", newTerm });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTermById = async (req, res) => {
  try {
    const id = req.params.id;
    const { term } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const term1 = await Dictionary.findById(id);
    if (!term1) {
      return res.status(404).send({ message: "Bunday term mavjud emas!" });
    }
    const updatedTerm = await Dictionary.updateOne(
      { _id: id },
      { term, letter: term[0] }
    );
    res.status(200).send({ message: "Updated succesfully", updatedTerm });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTermById = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).send({ message: "ID noto'g'ri" });
  }
  try {
    const term = await Dictionary.findById(id);
    if (!term) {
      return res.status(404).send({ message: "Bunday term mavjud emas!" });
    }
    const deletedTerm = await Dictionary.deleteOne({ _id: id });
    return res.send({ msg: "Deleted successfully", deletedTerm });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getTerm,
  findTermById,
  addTerm,
  updateTermById,
  deleteTermById,
};
