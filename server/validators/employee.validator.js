import { body } from "express-validator";

export const createValidation = [
    body("firstName")
        .not()
        .isEmpty()
        .withMessage("firstName is required"),
]

export const updateValidation = [
    body("firstName")
        .not()
        .isEmpty()
        .withMessage("firstName is required"),
]
