import statusConst from "../common/statusConstants";
import models from "../models";
import dbHelper from "../common/dbHelper";
import uniqueId from "uniqid";
import { Op } from "sequelize";


/**
 * Category registrasion
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

const CategoryServices = {
  createDepartment
};

export default CategoryServices;
