import { body } from "express-validator";
import { get, isEmpty } from "lodash";

const _ = { get, isEmpty };

export const createCategory = () => {
  return [
    body("categoryName")
      .not()
      .isEmpty()
      .withMessage("Category name is required"),
    body("description").not().isEmpty().withMessage("description is required"),
  ];
};

export const updateCategory = () => {
  return [
    body("categoryName")
      .not()
      .isEmpty()
      .withMessage("Category name is required"),
    body("description").not().isEmpty().withMessage("description is required"),
  ];
};

export default { createCategory , updateCategory };
