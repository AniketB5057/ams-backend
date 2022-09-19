
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


const categoryController = {
  createDepartment,
};

export default categoryController;