
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

const employeeController = {
  createemployee,

};

export default employeeController;