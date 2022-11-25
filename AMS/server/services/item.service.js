import statusConst from "../common/statusConstants";
import models from "../models";
import dbHelper from "../common/dbHelper";
import Helper from "../common/helper";
import uniqueId from "uniqid";
import { get, isEmpty, has, isObject, stubTrue } from "lodash";
const _ = { get, isEmpty, has };
import { Op } from "sequelize";
import sequelize from "sequelize";

/**
 * Category registrasion
 *
 * @param Request request
 */
const createItem = async (req) => {
  let responseData = statusConst.error;
  const createdBy = req.tokenUser.id
  let { itemName, typeOfAsset, description, serialNo, cost, datePurchased, categoryId } = req.body;
  try {

    const itemTag = uniqueId.time().toUpperCase();

    const categoryData = await models.categoryDetails.findOne({ where: { [Op.and]: { id: categoryId, isActive: true } } });
    if (!categoryData) { throw new Error("categoryDetails not found") }

    const item = await models.item.create({ itemTag, typeOfAsset, itemName, description, serialNo, cost, datePurchased, categoryId, createdBy, userId: createdBy });

    if (!item) {
      throw new Error("Unable to create new Item");
    } else {
      responseData = { status: 200, message: "Item create successfully", success: true, data: item };
    }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };
    try {
      if (["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error.name)) {
        errors = dbHelper.formatSequelizeErrors(error);
        responseData = { status: 400, errors, success: false };
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
  let defaultWhere = { isActive: true };

  if (_.has(entityParams, "q") && !_.isEmpty(searchText)) {
    defaultWhere = {
      [Op.or]: {
        first_name: { [Op.like]: `%${searchText}%` },
        last_name: { [Op.like]: `%${searchText}%` },
        id: { [Op.like]: `%${searchText}%` },
        typeOfAsset: sequelize.where(
          sequelize.cast(sequelize.col("item.typeOfAsset"), "varchar"), {
          [Op.like]: `%${searchText}%`
        })
      },
      isActive: true
    };
  }

  try {
    const { offset, limit, pagination } = Helper.dataPagination(entityParams);

    const itemDeatail = await models.item.findAndCountAll({
      include: [
        {
          model: models.categoryDetails,
          attributes: ["id", "categoryName"],
          as: 'category'
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]]
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
  const updatedBy = req.tokenUser.id
  const { itemName, typeOfAsset, description, serialNo, cost, datePurchased, categoryId } = req.body;
  const { id } = req.params;
  try {
    const item = await models.item.findOne({ where: { id: id } });

    const categoryData = await models.categoryDetails.findOne({ where: { [Op.and]: { id: categoryId, isActive: true } } });
    if (!categoryData) { throw new Error("categoryDetails not found") }

    if (!item) {
      throw new Error("item not found")
    } else {
      item.update({ itemName, typeOfAsset, description, serialNo, cost, datePurchased, categoryId, updatedBy });
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
    let statuschange
    if (itemDatae.isActive == 0) {
      statuschange = 1;
    } else {
      statuschange = 0;
    }
    let itemData = await models.item.update({ isActive: statuschange }, { where: { id: id } });

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
