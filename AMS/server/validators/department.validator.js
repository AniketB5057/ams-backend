import { body } from "express-validator";

export const createValidation = [
    body("name")
        .not()
        .isEmpty()
        .withMessage("name is required"),
]

export const updateValidation = [
    body("name")
        .not()
        .isEmpty()
        .withMessage("name is required"),
]