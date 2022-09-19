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
const createemployee = async (req) => {
    // console.log("req---->>>",req.body);
    let responseData = statusConst.error;
    let { employeeUniqueId, email, firstName, lastName, phone, description, userId, employeeId ,departmentId } = req.body;

    try {
        const employee = await models.employee.create({ email, firstName, lastName, phone, userId, departmentId, description, employeeUniqueId , employeeId});

        if (!employee) {
            throw new Error("Unable to create new employee");
        } else {
            responseData = { status: 200, message: "employee create successfully", success: true, data: employee };
        }
    } catch (error) {
        console.log("error---->>>>",error);
        let errors = {};
        responseData = { status: 400, message: error.message };
        try {
            if (["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error)) {
                errors = dbHelper.formatSequelizeErrors(error);
                responseData = { status: 200, message: 'employee already exist', success: false };
            }
        } catch (error) {
            responseData = { message: error.message };
        }
    }
    return responseData;
};


const employeeServices = {
    createemployee,

};

export default employeeServices;
