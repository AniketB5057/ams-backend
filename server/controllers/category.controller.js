import categoryServices from "../services/category.services";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };


// Single Category info
const category = async (req, res) => {
  const categoryId = _.get(req, "params.id", 0);

  categoryServices.category(categoryId).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

// Create Category
const createCategory = async (req, res, next) => {
  categoryServices.createCategory(req).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message });
  });
};

// Get Category info
const categoryDetails = async (req, res, next) => {
  categoryServices.categoryDetails(req).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

// Update category info
const updateCategory = async (req, res, next) => {
  categoryServices.updateCategory(req).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

// Delete category
const deleteCategory = async (req, res, next) => {
  const categoryId = _.get(req, "params.id", {});
  categoryServices.deleteCategory(categoryId).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};


const categoryController = {
  category,
  categoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryController;
