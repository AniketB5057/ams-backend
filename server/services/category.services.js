import statusConst from "../common/statusConstants";
// import { get, isEmpty, isObject, omit, find, chain, has, map, includes, result, } from "lodash";
import _, { result } from "lodash";
// const _ = { get, isEmpty, isObject, omit, find, chain, has };
import models from "../models";
import appConfig from "../common/appConfig";
import { userRoles, commonStatuses } from "../common/appConstants";
import Helper from "../common/helper";
import dbHelper from "../common/dbHelper";
import modelConstants from "../common/modelConstants";
import { Op } from "sequelize";
import sequelize from "sequelize";

/**
 *Single Company detail
 *
 * @param Request request
 */
const categoryProfile = async (payload) => {
  let responseData = statusConst.fetchResourceError;
  try {
    const categoryId = _.get(payload, "categoryId", "");

    const categoryData = await models.categoryDetails.findOne({
      where: { id: categoryId },
    });

    let categoryInfo = _.get(categoryData, "dataValues", {});

    if (categoryData) {
      responseData = {
        ...statusConst.fetchSucccess,
        message: "category fetch successfully",
        success: true,
        categoryInfo,
      };
    } else {
      responseData = {
        ...statusConst.error,
        message: "category does not exist",
        success: false,
      };
    }
  } catch (error) {
    responseData = {
      ...statusConst.error,
      message: "category not found",
      success: false,
    };
  }
  return responseData;
};

/**
 * Category Details
 *
 * @param Request request
 */

const categoryDetails = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  let defaultWhere = { isActive: 1 };
  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      isActive: 1,
      [Op.or]: {
        category_name: { [Op.like]: `%${searchText}%` },
        id: { [Op.like]: `%${searchText}%` },
      },
    };
  }
  try {
    const entityPagination = Helper.dataPagination(entityParams);

    const categoryDeatail = await models.categoryDetails.findAndCountAll({
      where: defaultWhere,
      offset: entityPagination.offset,
      limit: entityPagination.limit,
      order: [["id", "DESC"]],
    });
    let pagination = entityPagination.pagination;

    pagination["totalPages"] = Math.ceil(
      (categoryDeatail || categoryDeatail).count / pagination.pageSize
    );
    pagination["pageRecords"] =
      ((categoryDeatail || {}).rows || []).length || 0;

    responseData = {
      ...statusConst.success,
      success: true,
      pagination,
      data: categoryDeatail,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};

/**
 * Category category_List
 *
 * @param Request request
 */

const categoryList = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  let defaultWhere = {
    /*  status: 1 */
  };

  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      //status: 1,
      [Op.or]: {
        category_name: { [Op.like]: `%${searchText}%` },
        id: { [Op.like]: `%${searchText}%` },
      },
    };
  }

  try {
    const entityPagination = Helper.dataPagination(entityParams);

    const categoryList = await models.categoryDetails.findAll({
      // attributes: modelConstants.category_List,
      where: defaultWhere,
      offset: entityPagination.offset,
      limit: entityPagination.limit,
      order: [["id", "DESC"]],
    });
    let pagination = entityPagination.pagination;
    pagination["totalPages"] = Math.ceil(
      ((categoryList || {}).count || 0) / pagination.pageSize
    );
    pagination["pageRecords"] = ((categoryList || {}).rows || []).length || 0;
    responseData = {
      ...statusConst.success,
      success: true,
      data: categoryList,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }

  return responseData;
};

/**
 *Update Category detail
 *
 * @param Request request
 */
const updateCategory = async (req) => {
  console.log("req========>>>>>", req.body);
  let responseData = statusConst.error;

  const categoryId = _.get(req, "params.id", 0);
  let data = _.get(req, "body", {});
  try {
    //Check if  exist
    const category = await models.categoryDetails.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      return {
        ...statusConst.error,
        message: "category not found",
        success: false,
      };
    } else {
      const categoryUpdatePayload = {
        categoryName: data.categoryName || "",
        description: data.description || "",
        status: commonStatuses.ACTIVE.id,
      };
      category.update({ ...categoryUpdatePayload });
    }
    responseData = {
      ...statusConst.success,
      message: "Category udated successfully",
      success: true,
    };
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
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
      return {
        ...statusConst.error,
        message: "category not found",
        success: false,
      };
    } else {
      category.destroy();
    }
    responseData = {
      ...statusConst.success,
      message: "category deleted successfully",
      success: true,
    };
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
        responseData = { status: 200, message: 'Category already exist', success: false };
      }
    } catch (error) {
      responseData = { message: error.message };
    }
  }
  return responseData;
};




/**
 * Multiple Delete Category
 *
 * @param Request request
 */

const CategoryServices = {
  categoryProfile,
  categoryDetails,
  categoryList,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default CategoryServices;
