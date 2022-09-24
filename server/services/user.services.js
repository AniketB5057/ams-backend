import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import statusConst from "../common/statusConstants";
import { get, isEmpty, isObject, omit, find, chain, has } from "lodash";
const _ = { get, isEmpty, isObject, omit, find, chain, has };
import models from "../models";
import appConfig from "../common/appConfig";
import { userRoles, commonStatuses } from "../common/appConstants";
import Helper from "../common/helper";
import uniqueId from "uniqid";
import dbHelper from "../common/dbHelper";
import modelConstants from "../common/modelConstants";
import { Op } from "sequelize";

/**
 * Login to user and generate JWT
 *
 * @param Request request
 */
const login = async (req) => {
  let responseData = statusConst.authError;
  try {
    const { email, password } = req;
    const User = await models.user.findOne({ where: { email: email, isActive: true } });

    const userPassword = _.get(User, "password", null);
    const validPassword = await bcrypt.compare(password, userPassword);

    if (!_.isEmpty(User) && validPassword) {
      const tokenData = await generateToken({ id: User.id });
      const token = _.get(tokenData, "token", null);
      if (token) {
        await User.update({ token });
        responseData = { status: 200, message: "Login successful", data: { token } };
      }
    }
  } catch (err) {
    responseData = { status: 422, message: err.message };
  }
  return responseData;
};

const generateToken = async (options = {}) => {
  let responseData = statusConst.error;

  const userId = _.get(options, "id", 0);
  const updateToken = _.get(options, "updateToken", false) || false;

  try {
    let User = await models.user.findOne({
      attributes: ["id", "email", "firstName", "lastName", "isActive"],
      where: { id: userId },
    });

    if (_.isEmpty(User)) { throw new Error("User not found"); }

    let userData = User.get({ plain: true }) || {};
    const token = jwt.sign(userData, appConfig.jwtSecretKey);
    if (updateToken == true) { await User.update({ token }) }

    responseData = { status: 200, message: 'Success', token, success: true };
  } catch (error) {
    responseData = { status: 422, message: error.message, success: false };
  }
  return responseData;
};

const createUser = async (req) => {
  let responseData = statusConst.error;
  let { email, password, firstName, lastName, phone } = req.body;
  try {

    const userUniqueId = uniqueId.time().toUpperCase();
    let hashPassword = await bcrypt.hash(password, appConfig.bcryptSaltRound);

    const users = await models.user.create({ uniqueId: userUniqueId, email, password: hashPassword, firstName, lastName, phone });

    if (!users) {
      throw new Error("Unable to create new user");
    } else { responseData = { status: 200, message: "user create successfully", success: true, data: users }; }
  } catch (error) {
    let errors = {};
    responseData = { status: 400, message: error.message };
    try {
      if (["SequelizeValidationError", "SequelizeUniqueConstraintError"].includes(error.name)) {
        errors = dbHelper.formatSequelizeErrors(error);
        responseData = { status: 200, errors, success: false };
      }
    } catch (error) {
      responseData = { status: 400, message: error.message };
    }
  }
  return responseData;
};

const findByToken = async (token) => {
  let responseData = statusConst.error;
  try {
    // Find user by token
    const User = await models.user.findOne({
      where: {
        token: token,
        isActive: true,
      },
    });
    console.log("User---->", User);
    if (!_.isEmpty(User) && _.isObject(User)) {
      responseData = { status: 200, message: "Success", success: true, data: User };
    } else {
      responseData = { status: 422, message: "user not found", success: false };
    }
  } catch (error) {
    console.log("error--->", error);
    responseData = { status: 422, message: error.message };
  }

  return responseData;
};

const changePassword = async (payload) => {
  let responseData = statusConst.authError;

  try {
    const userId = _.get(payload, "tokenUser.id", 0);

    const currentPassword = _.get(payload, "formData.currentPassword", "");
    const newPassword = _.get(payload, "formData.newPassword", "");

    const userData = await models.user.findOne({
      where: {
        id: userId,
        isActive: true
      },
    });

    if (userData) {
      const validPassword = await bcrypt.compare(currentPassword, userData.password);

      if (validPassword) {
        const hashPassword = await bcrypt.hash(newPassword, appConfig.bcryptSaltRound);

        userData.password = hashPassword;
        await userData.save();

        responseData = { status: 200, message: "Password change succesfully", success: true };
      } else {
        responseData = { status: 400, message: "Current password is not valid", success: false };
      }
    } else {
      responseData = { status: 404, message: "User not found", success: false };
    }
  } catch (error) {
    responseData = { status: 422, message: error.message, success: false };
  }
  return responseData;
};

const updateUser = async (req) => {
  let responseData = statusConst.error;

  const userId = _.get(req, "params.id", 0);
  let data = _.get(req, "body", {});
  const checkUser = _.get(req, "tokenUser", {});
  try {
    //Check if  exist
    const user = await models.user.findOne({
      where: { id: userId },
    });
    if (!user) {
      return {
        ...statusConst.error,
        message: "User not found",
        success: false,
      };
    } else {
      const userUpdatePayload = {
        user_role_id: data.user_role_id || "",
        email: data.email || "",
        token: data.token || "",
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        dob: data.dob || "",
        password:
          (await bcrypt.hash(data.password, appConfig.bcryptSaltRound)) || "",
        status: commonStatuses.ACTIVE.id,
        updated_by: checkUser.first_name + " " + checkUser.last_name,
      };

      const updatedUser = user.update({ ...userUpdatePayload });
      responseData = {
        ...statusConst.success,
        message: "User udated successfully",
        success: true,
        updatedUser: updatedUser,
      };
    }
  } catch (error) {
    responseData = { ...statusConst.error, message: error.message };
  }
  return responseData;
};

const logout = async (req) => {
  let responseData = statusConst.error;
  let tokenUser = _.get(req, "tokenUser", {});
  try {
    //Check if  exist
    const user = await models.user.findOne({
      where: { id: tokenUser.id },
    });
    if (!user) {
      return {
        ...statusConst.error,
        message: "user not found",
        success: false,
      };
    } else {
      user.update({ token: "" });
      responseData = {
        ...statusConst.success,
        message: "user logout successfully",
        success: true,
      };
    }
  } catch (error) {
    responseData = {
      ...statusConst.error,
      message: "User already loged out",
      success: false,
    };
  }
  return responseData;
};


const UserServices = {
  createUser,
  login,
  findByToken,
  generateToken,
  changePassword,
  logout,
  updateUser,
};

export default UserServices;
