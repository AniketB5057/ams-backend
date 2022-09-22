
import employeeServices from "../services/employee.service";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };

const createemployee = async (req, res, next) => {
    employeeServices.createemployee(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

// Get Category info
const employeeDetails = async (req, res, next) => {
  employeeServices.employeeDetails(req).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

// Single Category info
const employee = async (req, res) => {
  const employeeId = _.get(req, "params.id", 0);

  employeeServices.employee(employeeId).then((result) => {
    res.status(result.status).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

const updateemployee = (req, res) => {
  employeeServices.updateemployee(req).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

const deleteemployee = (req, res) => {
  const ID = _.get(req, "params.id", 0);
  employeeServices.deleteemployee(ID).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
  });
};


const employeeController = {
  createemployee,
  employeeDetails,
  employee,
  updateemployee,
  deleteemployee
};

export default employeeController;