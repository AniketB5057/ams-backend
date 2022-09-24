import { body } from "express-validator";
import { get, isEmpty, values } from "lodash";
import models from "../models";
const _ = { get, isEmpty };

export const createItemValidation = [
    body("itemName")
        .not()
        .isEmpty()
        .withMessage("itemName is required"),
]