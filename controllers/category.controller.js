const { errorHandler } = require("../helpers/errorHandler");
const Category = require("../schemas/category");
const mongoose = require("mongoose");
const { categoryValidations } = require("../validations/category.valid");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("parent_cat_id");
    res.send(categories);
  } catch (error) {
    errorHandler(error, res);
  }
};

const findCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const category = await Category.findOne({ _id: id }).populate(
      "parent_cat_id"
    );
    if (!category) {
      return res
        .status(400)
        .send({ message: "Bunday kategoriya mavjud emas!" });
    }
    res.send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const findCategoryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const category = await Category.findOne({ name });
    if (!category) {
      return res
        .status(400)
        .send({ message: "Bunday kategoriya mavjud emas!" });
    }
    res.send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const addCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidations(req.body);
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const newCategory = await Category.create(value);
    newCategory.parent_cat_id = newCategory.id;

    await newCategory.save();
    res.status(201).send({ msg: "New category added", newCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, parent_cat_id } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    if (parent_cat_id && !mongoose.isValidObjectId(parent_cat_id)) {
      return res.status(400).send({ message: "Parent ID noto'g'ri" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Bunday category mavjud emas!" });
    }
    const updatedCategory = await Category.updateOne(
      { _id: id },
      { name, parent_cat_id }
    );
    res.status(200).send({ message: "Updated successfully", updatedCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).send({ message: "ID noto'g'ri" });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).send({ message: "Bunday category mavjud emas!" });
    }
    const deletedCategory = await Category.deleteOne({ _id: id });
    res.send({ msg: "Deleted successfully", deletedCategory });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  getCategories,
  findCategoryById,
  addCategory,
  updateCategoryById,
  deleteCategoryById,
  findCategoryByName,
};
