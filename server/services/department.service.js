import statusConst from "../common/statusConstants";
import models from "../models";
import dbHelper from "../common/dbHelper";
import uniqueId from "uniqid";
import { get, isEmpty, isObject } from "lodash";
const _ = { get, isEmpty };
import { commonStatuses } from "../common/appConstants";
import { Op } from "sequelize";


/**
 * data registrasion
 *
 * @param Request request
 */
const createDepartment = async (req) => {
  let responseData = statusConst.error;
  let { name, description } = req.body;

  try {
    const departmentUniqueId = uniqueId.time().toUpperCase();

    const department = await models.department.create({ name, description, departmentUniqueId });

    if (!department) {
      throw new Error("Unable to create new Department");
    } else {
      responseData = { status: 200, message: "Department create successfully", success: true, data: department };
    }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };
    try {
      if (["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error.name)) {
        errors = dbHelper.formatSequelizeErrors(error);
        responseData = { status: 200, message: 'Department already exist', success: false };
      }
    } catch (error) {
      responseData = { message: error.message };
    }
  }
  return responseData;
};

const updateController = async (req) => {
  let responseData = statusConst.error;
  const { name, description, status } = req.body;
  const { id } = req.params;
  try {
    const department = await models.department.findOne({ where: { id: id } });

    if (!department) {
      throw new Error("department not found")
    } else {
      department.update({ name, description, status });
    }
    responseData = { status: 200, message: "data update successfully", success: true };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const getallDepartment = async (req) => {
  let responseData = statusConst.error;
  try {
    const departmentData = await models.department.findAll({ where: { isActive: true } });
    if (!departmentData) {
      throw new Error("department not found")
    } else {
      responseData = { status: 200, success: true, departmentData };
    }
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const getDepartment = async (data) => {
  let responseData = statusConst.error;
  try {
    let departmentData = await models.department.findOne({ where: { id: data } });

    if (!departmentData) {
      throw new Error("department not found")
    }
    responseData = { status: 200, success: true, departmentData };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};

const deleteDepartment = async (departmentId) => {
  let responseData = statusConst.error;
  try {
    let departmentDatae = await models.department.findOne({ where: { id: departmentId } });
    if (departmentDatae.isActive == 0) { throw new Error("department already deleted") }

    let departmentData = await models.department.update({ isActive: 0 }, { where: { id: departmentId } });

    if (departmentData === [0]) {
      throw new Error("department not update")
    } else if (departmentData === [1]) {
    }
    responseData = { status: 200, message: "Department delete successfully", success: true, data: departmentData };
  } catch (error) {
    responseData = { status: 400, message: error.message, success: false };
  }
  return responseData;
};


const dataServices = {
  createDepartment,
  updateController,
  getallDepartment,
  getDepartment,
  deleteDepartment

};

export default dataServices;
