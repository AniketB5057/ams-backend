
import departmentServices from "../services/department.service";
import { get, isEmpty } from "lodash";
const _ = { get, isEmpty };

const createDepartment = async (req, res, next) => {
  departmentServices.createDepartment(req).then((result) => {
    res.status(result.status).send(result);
  })
    .catch((err) => {
      res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
    });
};

const updateController = (req, res) => {
  departmentServices.updateController(req).then((result) => {
    res.status(200).send(result);
  }).catch((err) => {
    res.status(422).send({ status: 422, message: err.message || "Something went wrong!" });
  });
};

const getallDepartment = (req, res) => {
  departmentServices.getallDepartment(req).then((result) => {
    res.status(200).send(result);
  })
    .catch((error) => {
      res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
    });
};

const getDepartment = (req, res) => {
  const bodydata = _.get(req, "params.id", 0);
  departmentServices.getDepartment(bodydata).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
  });
};

const deleteDepartment = (req, res) => {
  const ID = _.get(req, "params.id", 0);
  departmentServices.deleteDepartment(ID).then((result) => {
    res.status(200).send(result);
  }).catch((error) => {
    res.status(422).send({ status: 422, message: error.message || "Something went wrong!", });
  });
};

const departmentController = {
  createDepartment,
  updateController,
  getallDepartment,
  getDepartment,
  deleteDepartment

};

export default departmentController;