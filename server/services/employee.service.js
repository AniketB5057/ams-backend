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
 * data registrasion
 *
 * @param Request request
 */
const createemployee = async (req) => {

  let responseData = statusConst.error;
  let {
    email,
    firstName,
    lastName,
    phone,
    description,
    userId,
    departmentId
  } = req.body;

  try {

    const employeeUniqueId = uniqueId.time().toUpperCase();

    const employee = await models.employee.create({
      email,
      firstName,
      lastName,
      phone,
      userId,
      departmentId,
      description,
      employeeUniqueId
    });

    if (!employee) {
      throw new Error("Unable to create new employee");
    } else {
      responseData = {
        status: 200,
        message: "employee create successfully",
        success: true,
        data: employee,
      };
    }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };
    try {
      if (
        ["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(
          error
        )
      ) {
        errors = dbHelper.formatSequelizeErrors(error.message);
        responseData = {
          status: 200,
          message: "employee already exist",
          success: false,
        };
      }
    } catch (error) {
      responseData = { message: error.message };
    }
  }
  return responseData;
};

//  employee Details
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

// Single employee detail
const employee = async (employeeId) => {
  let responseData = statusConst.error;
  try {
    const employeeData = await models.employee.findOne({
      where: { [Op.and]: { id: employeeId, isActive: true } },
      include: [
        {
          model: models.department,
          as: "departmentDetails",
        },
      ],
    });

    if (employeeData) {
      responseData = {
        status: 200,
        message: "employee fetch successfully",
        success: true,
        employeeData,
      };
    } else {
      responseData = {
        status: 400,
        message: "employee does not exist",
        success: false,
      };
    }
  } catch (error) {
    console.log(error);
    responseData = {
      status: 400,
      message: "employee not found",
      success: false,
    };
  }
  return responseData;
};

const updateemployee = async (req) => {
  let responseData = statusConst.error;
  const { email, firstName, lastName, phone, userId, departmentId, description } = req.body;
  const { id } = req.params;
  try {
    const employee = await models.employee.findOne({ where: { id: id } });

    if (!employee) {
      throw new Error("employee not found")
    } else {
      employee.update({ email, firstName, lastName, phone, userId, departmentId, description });
    }
    responseData = { status: 200, message: "data udated successfully", success: true };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const deleteemployee = async (id) => {
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

const employeeServices = {
  createemployee,
  employeeDetails,
  employee,
  updateemployee,
  deleteemployee

};

export default employeeServices;
