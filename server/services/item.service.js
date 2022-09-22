import statusConst from "../common/statusConstants";
import models from "../models";
import dbHelper from "../common/dbHelper";
import Helper from "../common/helper";
import uniqueId from "uniqid";
import { get, isEmpty, has, isObject } from "lodash";
const _ = { get, isEmpty, has };
import { commonStatuses } from "../common/appConstants";
import { Op } from "sequelize";

/**
 * Category registrasion
 *
 * @param Request request
 */
const createItem = async (req) => {
  let responseData = statusConst.error;

  let { itemName, description, serialNo, cost, datePurchased, qty, categoryId, userId } = req.body;
  try {

    const itemTag = uniqueId.time().toUpperCase();
    const item = await models.item.create({ itemTag, itemName, description, serialNo, cost, datePurchased, qty, categoryId, userId });

    if (!item) {
      throw new Error("Unable to create new Category");
    } else {
      responseData = { status: 200, message: "Category create successfully", success: true, data: item };
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


const itemDetails = async (req) => {
  let responseData = statusConst.error;
  const entityParams = _.get(req, "query", {});
  const searchText = _.get(entityParams, "q", "");
  let defaultWhere = {};

  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      [Op.or]: {
        first_name: { [Op.like]: `%${searchText}%` },
        last_name: { [Op.like]: `%${searchText}%` },
        id: { [Op.like]: `%${searchText}%` },
      },
    };
  }

  try {
    const { offset, limit, pagination } = Helper.dataPagination(entityParams);

    const itemDeatail = await models.item.findAndCountAll({
      where: defaultWhere,
      include: [
        {
          model: models.categoryDetails,
          attributes: ["id", "categoryName"],
          as: 'category'
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    if (itemDeatail.rows.length > 0) {
      pagination["totalPages"] = Math.ceil(
        (itemDeatail || itemDeatail).count / pagination.pageSize
      );
      pagination["pageRecords"] =
        ((itemDeatail || {}).rows || []).length || 0;

      responseData = {
        status: 200, message: "data fetch successfully", pagination, data: itemDeatail, success: true,
      };
    } else {
      responseData = {
        status: 400, message: "item not exist", success: false,
      };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const itemGet = async (itemId) => {
  let responseData = statusConst.error;
  try {
    const itemData = await models.item.findOne({
      where: { [Op.and]: { id: itemId, isActive: true } },
      include: [
        {
          model: models.categoryDetails,
          as: 'category'
        },
      ],
    });

    if (itemData) {
      responseData = { status: 200, message: "item fetch successfully", success: true, itemData, };
    } else {
      responseData = { status: 400, message: "item does not exist", success: false, };
    }
  } catch (error) {
    console.log(error);
    responseData = { status: 400, message: "item not found", success: false, };
  }
  return responseData;
};

const updateItem = async (req) => {
  let responseData = statusConst.error;
  const { itemName, description, serialNo, cost, datePurchased, qty, categoryId, userId } = req.body;
  const { id } = req.params;
  try {
    const item = await models.item.findOne({ where: { id: id } });

    if (!item) {
      throw new Error("item not found")
    } else {
      item.update({ itemName, description, serialNo, cost, datePurchased, qty, categoryId, userId });
    }
    responseData = { status: 200, message: "data update successfully", success: true };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const deleteItem = async (id) => {
  let responseData = statusConst.error;
  try {
    let itemDatae = await models.item.findOne({ where: { id: id } });
    if (itemDatae.isActive == 0) { throw new Error("item already deleted") }

    let itemData = await models.item.update({ isActive: 0 }, { where: { id: id } });

    if (itemData === [0]) {
      throw new Error("item not update")
    } else if (itemData === [1]) {
    }
    responseData = { status: 200, message: "item delete successfully", success: true, data: itemData };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const itemServices = {
  createItem,
  itemDetails,
  itemGet,
  updateItem,
  deleteItem
};

export default itemServices;
