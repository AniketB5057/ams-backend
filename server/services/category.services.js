import statusConst from "../common/statusConstants";
import _ from "lodash";
import models from "../models";
import appConfig from "../common/appConfig";
import { userRoles, commonStatuses } from "../common/appConstants";
import Helper from "../common/helper";
import dbHelper from "../common/dbHelper";
import modelConstants from "../common/modelConstants";
import { and, Op } from "sequelize";
import sequelize from "sequelize";

// Single category detail
const category = async (categoryId) => {
  let responseData = statusConst.error;
  try {

    const categoryData = await models.categoryDetails.findOne({
      where: { [Op.and]: { id: categoryId, isActive: true } }
    });

    if (categoryData) {
      responseData = { status: 200, message: "category fetch successfully", success: true, categoryData };
    } else {
      responseData = { status: 400, message: "category does not exist", success: false };
    }
  } catch (error) {
    responseData = { status: 400, message: "category not found", success: false };
  }
  return responseData;
};

//  Category Details

const categoryDetails = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  let defaultWhere = {};

  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      [Op.or]: {
        category_name: { [Op.like]: `%${searchText}%` },
        id: { [Op.like]: `%${searchText}%` },
      }
    };
  }

  try {
    const { offset, limit, pagination } = Helper.dataPagination(entityParams);

    const categoryDeatail = await models.categoryDetails.findAndCountAll({
      where: defaultWhere,
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    if (categoryDeatail.rows.length > 0) {
      pagination["totalPages"] = Math.ceil((categoryDeatail || categoryDeatail).count / pagination.pageSize);
      pagination["pageRecords"] = ((categoryDeatail || {}).rows || []).length || 0;

      responseData = { status: 200, message: "data fetch successfully", pagination, data: categoryDeatail, success: true };
    } else {
      responseData = { status: 400, message: "categories not exist", success: false };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};


// Update Category detail
const updateCategory = async (req) => {
  let responseData = statusConst.error;
  // let createdBy =

  const categoryId = _.get(req, "params.id", 0);
  let { categoryName, description } = req.body;
  try {
    //Check if  exist
    const category = await models.categoryDetails.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return { status: 404, message: "category not found", success: false };
    } else {
      let catetoryData = category.update({ categoryName, description, isActive: true });

      if (_.isEmpty(catetoryData)) {
        responseData = { status: 200, message: "Unable to updated category", success: true };
      } else {
        responseData = { status: 200, message: "Category updated successfully", success: true };
      }
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

/**
 *Delete Category
 *
 * @param Request request
 */
const deleteCategory = async (id) => {
  let responseData = statusConst.error;

  try {

    //Check if  exist
    const category = await models.categoryDetails.findOne({
      where: { id: id },
    });

    if (!category) {
      return { status: 200, message: "category not found", success: false };
    } else {

      let catetoryData = category.update({ isActive: false });
      if (_.isEmpty(catetoryData)) {
        responseData = { status: 200, message: "Unable to deleted category", success: true };
      } else {
        responseData = { status: 200, message: "Category deleted successfully", success: true };
      }
    }

  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};

/**
 * Category registrasion
 *
 * @param Request request
 */
const createCategory = async (req) => {
  let responseData = statusConst.error;

  let { categoryName, description } = req.body;
  try {

    const categoryDetails = await models.categoryDetails.create({ categoryName, description });

    if (!categoryDetails) {
      throw new Error("Unable to create new Category");
    } else {
      responseData = { status: 200, message: "Category create successfully", success: true, data: categoryDetails };
    }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };
    try {
      if (["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error.name)) {
        errors = dbHelper.formatSequelizeErrors(error);
        let dbError = Object.values(errors).toString()
        responseData = { status: 200, message: dbError, success: false };
      }
    } catch (error) {
      responseData = { message: error.message };
    }
  }
  return responseData;
};


const CategoryServices = {
  category,
  categoryDetails,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryServices;
