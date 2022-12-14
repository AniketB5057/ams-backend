import statusConst from "../common/statusConstants";
import _ from "lodash";
import models from "../models";
import Helper from "../common/helper";
import { and, Op } from "sequelize";

// Single category detail
const category = async (categoryId) => {
  let responseData = statusConst.error;
  try {

    const categoryData = await models.categoryDetails.findOne({ where: { [Op.and]: { id: categoryId, isActive: true } } });
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
  let { categoryName } = req.body;
  try {
    //Check if  exist
    const category = await models.categoryDetails.findOne({ where: { id: categoryId }, });

    if (!category) {
      return { status: 404, message: "category not found", success: false };
    } else {
      categoryName = categoryName.toUpperCase();
      let catetoryData = category.update({ categoryName, isActive: true });

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
    const category = await models.categoryDetails.findOne({ where: { id: id }, });
    let statuschange;
    if (category.isActive == 0) {
      statuschange = 1;
    } else {
      statuschange = 0;
    }
    let catetoryData = category.update({ isActive: statuschange });
    if (_.isEmpty(catetoryData)) {
      responseData = { status: 200, message: "Unable to deleted category", success: true };
    } else {
      responseData = { status: 200, message: "Category deleted successfully", success: true };
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

  let { categoryName, itemId } = req.body;
  try {
    categoryName = categoryName.toUpperCase()
    const categoryDetails = await models.categoryDetails.create({ categoryName, itemId });

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
        responseData = { status: 200, message: "Category already exist", success: false }
      }
    } catch (error) {
      responseData = { message: error.message };
    }
  }
  return responseData;
};

const categoryCombos = async (req) => {
  let responseData = statusConst.error;
  try {
    const categoriesDetails = await models.categoryDetails.findAll({
      where: { isActive: true, },
      include: [
        {
          model: models.item,
          as: 'employeeItems',
          required: false
        },
      ],
      order: [["id", "DESC"]],
    });
    return responseData = {
      status: 200, message: "data fetch successfully", data: categoriesDetails, success: true,
    };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const CategoryServices = {
  category,
  categoryDetails,
  categoryCombos,
  createCategory,
  updateCategory,
  deleteCategory,

};

export default CategoryServices;
