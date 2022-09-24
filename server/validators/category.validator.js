import { body } from "express-validator";

export const createValidation = [
  body("categoryName")
    .not()
    .isEmpty()
    .withMessage("Category name is required"),
  body("description").not().isEmpty().withMessage("description is required"),
];

export const updateValidation = [
  body("categoryName")
    .not()
    .isEmpty()
    .withMessage("Category name is required"),
  body("description").not().isEmpty().withMessage("description is required"),
];
