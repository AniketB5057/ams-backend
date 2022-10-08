import statusConst from "../common/statusConstants";
import models from "../models";
import dbHelper from "../common/dbHelper";
import Helper from "../common/helper";
import uniqueId from "uniqid";
import { get, isEmpty, has } from "lodash";
const _ = { get, isEmpty, has };
import { Op, where } from "sequelize";
const sequelize = models.sequelize;
import { UNIQUEID } from "../utils/constant"
import { encrypt, decrypt } from "../utils/encrypDecrypt";
import TinyURL from "tinyurl";
/**
 * data registrasion
 *
 * @param Request request
 */
const createEmployee = async (req) => {

  let responseData = statusConst.error;
  let { email, firstName, lastName, phone, description, departmentId } = req.body;
  const createdBy = req.tokenUser.id
  try {
    let employee = await sequelize.transaction(async (t) => {
      let uniqId = uniqueId()
      const employee = await models.employee.create({ email, firstName, lastName, phone, departmentId, description, uniqueId:uniqId, employeeUniqueId, userId: createdBy, createdBy }, { transaction: t });
      if (!employee) { throw new Error("Unable to create new employee") }

      let cryptoKeyCredentials = encrypt(employee.id);
      let barcode = null;
      await TinyURL.shorten(`${process.env.BASE_URL}/api/employee/askldts/${uniqId}`).then((res, err) => {
        if (err) { throw new Error("Unable to create new employee") }
       
        barcode = res.slice(-8)
      });

      const idLength = employee.id.toString().length;
      const newId = UNIQUEID.substring(0, UNIQUEID.length - idLength);
      let employeeUniqueId = `${newId}${employee.id}`;

      await employee.update({ employeeUniqueId, barcode }, { where: { id: employee.id }, transaction: t })
      return employee
    })
    responseData = { status: 200, message: "employee create successfully", success: true, data: employee };
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

const employeeDetails = async (req) => {
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

    const employeeDeatail = await models.employee.findAndCountAll({
      where: defaultWhere,
      include: [
        {
          model: models.department,
          attributes: ["id", "name"],
          as: "departmentDetails",
        },
      ],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    if (employeeDeatail.rows.length > 0) {
      pagination["totalPages"] = Math.ceil(
        (employeeDeatail || employeeDeatail).count / pagination.pageSize
      );
      pagination["pageRecords"] =
        ((employeeDeatail || {}).rows || []).length || 0;

      responseData = {
        status: 200, message: "data fetch successfully", pagination, data: employeeDeatail, success: true,
      };
    } else {
      responseData = {
        status: 400, message: "employee not exist", success: false,
      };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const employee = async (employeeId) => {
  let responseData = statusConst.error;
  try {
    console.log(employeeId);
    // let employeeId = decrypt(data);
    const employeeData = await models.employee.findOne({
      where: { [Op.and]: { uniqueId: employeeId, isActive: true } },
      attributes: ["employeeUniqueId", "departmentId", "email", "firstName", "lastName", "phone"],
      include: [{
        model: models.department,
        attributes: ["name", "departmentUniqueId", "description"],
        as: "departmentDetails",
      }]
    });

    if (employeeData) {
      responseData = { status: 200, message: "employee fetch successfully", success: true, employeeData };
    } else {
      responseData = { status: 400, message: "employee does not exist", success: false };
    }
  } catch (error) {
    responseData = { status: 400, message: "employee not found", success: false, };
  }
  return responseData;
};

const updateEmployee = async (req) => {
  let responseData = statusConst.error;
  const { email, firstName, lastName, phone, userId, departmentId, description } = req.body;
  const { id } = req.params;
  const updatedBy = req.tokenUser.id
  try {
    const employee = await models.employee.findOne({ where: { id: id } });

    if (!employee) {
      throw new Error("employee not found")
    } else {
      employee.update({ email, firstName, lastName, phone, userId, departmentId, description, updatedBy });
    }
    responseData = { status: 200, message: "data update successfully", success: true };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const deleteEmployee = async (id) => {
  let responseData = statusConst.error;
  try {
    let employeeDatae = await models.employee.findOne({ where: { id: id } });
    if (employeeDatae.isActive == 0) { throw new Error("employee already deleted") }

    let employeeData = await models.employee.update({ isActive: 0 }, { where: { id: id } });

    if (employeeData === [0]) {
      throw new Error("employee not update")
    } else if (employeeData === [1]) {
    }
    responseData = { status: 200, message: "employee delete successfully", success: true, data: employeeData };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const assignItems = async (req) => {

  let responseData = statusConst.error;
  let { employeeId, itemIds, remarks } = req.body;
  const createdBy = req.tokenUser.id
  try {
    if (!Array.isArray(itemIds)) { throw new Error("itemIds is not a array") }

    const employeeAssigmentDetail = await sequelize.transaction(async (t) => {
      const employee = await models.employee.findOne({ where: { id: employeeId }, transaction: t })
      if (!employee) { throw new Error("employee does not exist") }

      let assignItems = [];
      for (let i = 0; i < itemIds.length; i++) {
        const element = itemIds[i];
        let neIndex = itemIds[([i] <= 0) ? [i] : [i] - 1];
        let oldItem
        if (i > 0) {
          oldItem = await models.item.findOne({ where: { id: neIndex }, transaction: t });
        }
        const item = await models.item.findOne({ where: { id: element }, transaction: t });


        if (!item) { throw new Error(`Item does not exist`) };
        if ((oldItem && oldItem.itemName == item.itemName) || item.isAssigned) { throw new Error(`This ${item.itemName} is already assing to another employee`) }

        let itemInfo = { itemId: element, employeeId: employeeId, createdBy: createdBy, userId: createdBy, remarks: remarks }
        assignItems.push(itemInfo)
      }
      let alreadyAssigned = await models.employeeAssignment.findAll({
        where: { employeeId: employee.id },
        include: [{
          model: models.item,
          as: "itemDetail",
          attributes: ["itemName", "datePurchased"]
        }],
        transaction: t
      })
      let employeeAssigment = await models.employeeAssignment.bulkCreate(assignItems, { returning: true }, { transaction: t })

      if (!employeeAssigment) { throw new Error("Unable to assign item to employee"); }
      await models.item.update({ isAssigned: true }, { where: { id: { [Op.in]: itemIds } }, transaction: t })

      return employeeAssigment
    });

    responseData = { status: 200, message: "items assign successfully", success: true, data: employeeAssigmentDetail }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const employeeComboDetail = async (req) => {
  let { employeeId } = req.params
  let responseData;
  let employee = await models.employee.findOne({
    where: { uniqueId: employeeId }
  })

  if (!employee) { throw new Error("employee details not found"); }

  let employeeAssigment = await models.employeeAssignment.findAll({
    where: { employeeId: employee.id },
    attributes: ["dateAssigned"],
    include: [{
      model: models.item,
      as: "itemDetail",
      attributes: ["itemTag", "itemName", "description", "serialNo", "cost", "datePurchased"],
      required: false
    }]
  });
  if (employeeAssigment.length > 0) {
    responseData = {
      status: 200, message: "data fetch successfully", data: employeeAssigment, success: true
    };
  } else {
    responseData = {
      status: 400, message: "item doesn't assign", success: true,
    };
  }
  return responseData;
}

const employeeServices = {
  createEmployee,
  employeeDetails,
  employee,
  updateEmployee,
  deleteEmployee,
  assignItems,
  employeeComboDetail

};

export default employeeServices;
