import { body } from "express-validator";
import { get, isEmpty, values } from "lodash";
import models from "../models";
const _ = { get, isEmpty };

export const createemployee = () => {
    return [
        body("firstName")
            .not()
            .isEmpty()
            .withMessage("firstName is required"),
    ]
}

export const updateemployee = () => {
    return [
        body("firstName")
            .not()
            .isEmpty()
            .withMessage("firstName is required"),
    ]
}


export default { createemployee, updateemployee }