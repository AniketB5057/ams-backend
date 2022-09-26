
import employeeServices from "../services/employee.service";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };

export const createEmployee = async (req, res, next) => {
  employeeServices.createEmployee(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

export const employeeDetails = async (req, res, next) => {
  employeeServices.employeeDetails(req).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const employee = async (req, res, next) => {
  const employeeId = _.get(req, "params.id", 0);

  employeeServices.employee(employeeId).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const updateEmployee = async (req, res, next) => {
  employeeServices.updateEmployee(req).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

export const deleteEmployee = async (req, res, next) => {
  const ID = _.get(req, "params.id", 0);
  employeeServices.deleteEmployee(ID).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
  });
};

export const assignItems = async (req, res, next) => {
  employeeServices.assignItems(req).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
  });
};

export const comboDetails = async (req, res, next) => {
  employeeServices.employeeComboDetail(req).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    console.log("errror-->", error);
    res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
  });
};
