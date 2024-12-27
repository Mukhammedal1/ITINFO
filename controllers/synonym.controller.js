const { errorHandler } = require("../helpers/errorHandler");
const Synonym = require("../schemas/synonym");
const mongoose = require("mongoose");
const { synonymValidation } = require("../validations/synonym.valid");

const getSynonyms = async (req, res) => {
  try {
    const synonyms = await Synonym.find()
      .populate("desc_id")
      .populate("dict_id");
    res.send(synonyms);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findSynonymById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const synonym = await Synonym.findOne({ _id: id })
      .populate("desc_id")
      .populate("dict_id");
    if (!synonym) {
      return res.status(400).send({ message: "Bunday synonym mavjud emas!" });
    }
    res.send({ synonym });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addSynonym = async (req, res) => {
  try {
    const { error, value } = synonymValidation(req.body);
    if (error) {
      return res.status(400).send({ msg: error.message });
    }
    if (!mongoose.isValidObjectId(value.desc_id)) {
      return res.status(400).send({ message: "Description ID noto'g'ri" });
    }
    if (!mongoose.isValidObjectId(value.dict_id)) {
      return res.status(400).send({ message: "Dictionary ID noto'g'ri" });
    }
    const newSynonym = await Synonym.create(value);
    res.status(201).send({ msg: "New synonym added", newSynonym });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateSynonymById = async (req, res) => {
  try {
    const id = req.params.id;
    const { desc_id, dict_id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    if (desc_id && !mongoose.isValidObjectId(desc_id)) {
      return res.status(400).send({ message: "Description ID noto'g'ri" });
    }
    if (dict_id && !mongoose.isValidObjectId(dict_id)) {
      return res.status(400).send({ message: "Dictionary ID noto'g'ri" });
    }
    const updatedSynonym = await Synonym.updateOne(
      { _id: id },
      { desc_id, dict_id }
    );
    res.status(200).send({ message: "Updated successfully", updatedSynonym });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteSynonymById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const deletedSynonym = await Synonym.deleteOne({ _id: id });
    res.send({ msg: "Deleted successfully", deletedSynonym });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getSynonyms,
  findSynonymById,
  addSynonym,
  updateSynonymById,
  deleteSynonymById,
};
