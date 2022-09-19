import { body } from "express-validator";
import { get, isEmpty, values } from "lodash";
import models from "../models";
const _ = { get, isEmpty };

export const createDepartment = () => {
    return [
        body("name")
            /*   .custom(async value => {
                  const department = await models.department.findOne({ where: { name: value } })
                  console.log("value--->", department);
              }) */
            .not()
            .isEmpty()
            .withMessage("name is required"),
        body("description").not().isEmpty().withMessage("description is required"),
    ]
}

export const updateDepartment = () => {
    return [
        body("name")
            /*   .custom(async value => {
                  const department = await models.department.findOne({ where: { name: value } })
                  console.log("value--->", department);
              }) */
            .not()
            .isEmpty()
            .withMessage("name is required"),
        body("description").not().isEmpty().withMessage("description is required"),
    ]
}

export default { createDepartment, updateDepartment }