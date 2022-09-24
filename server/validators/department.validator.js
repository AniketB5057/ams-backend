import { body } from "express-validator";

export const createValidation = [
    body("name")
        .not()
        .isEmpty()
        .withMessage("name is required"),
    body("description").not().isEmpty().withMessage("description is required"),
]

export const updateValidation = [
    body("name")
        .not()
        .isEmpty()
        .withMessage("name is required"),
    body("description").not().isEmpty().withMessage("description is required"),
]