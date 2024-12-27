const { errorHandler } = require("../helpers/errorHandler");
const Description = require("../schemas/description");
const mongoose = require("mongoose");
const { descriptionValidation } = require("../validations/description.valid");

const getDescriptions = async (req, res) => {
  try {
    const descriptions = await Description.find().populate("category_id");
    res.send(descriptions);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findDescriptionById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const description = await Description.findOne({ _id: id }).populate(
      "category_id"
    );
    if (!description) {
      return res
        .status(400)
        .send({ message: "Bunday description mavjud emas!" });
    }
    res.send({ description });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addDescription = async (req, res) => {
  try {
    const { error, value } = descriptionValidation(req.body);
    if(error){
      return res.status(400).send({msg:error.message})
    }
    if (!mongoose.isValidObjectId(value.category_id)) {
      return res.status(400).send({ message: "Category ID noto'g'ri" });
    }
    const newDescription = await Description.create(value);
    res.status(201).send({ msg: "New description added", newDescription });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateDescriptionById = async (req, res) => {
  try {
    const id = req.params.id;
    const { description, category_id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    if (category_id && !mongoose.isValidObjectId(category_id)) {
      return res.status(400).send({ message: "Category ID noto'g'ri" });
    }
    const updatedDescription = await Description.updateOne(
      { _id: id },
      { description, category_id }
    );
    res
      .status(200)
      .send({ message: "Updated successfully", updatedDescription });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteDescriptionById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const deletedDescription = await Description.deleteOne({ _id: id });
    res.send({ msg: "Deleted successfully", deletedDescription });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getDescriptions,
  findDescriptionById,
  addDescription,
  updateDescriptionById,
  deleteDescriptionById,
};
