import { body } from "express-validator";
import { get } from "lodash";

const _ = { get };

/**
 * Validate Login Authentication
 *
 */
export const loginValidation = [
  body("email").not().isEmpty().withMessage("Email is required"),
  body("password").not().isEmpty().withMessage("Password is required"),
];

//  CreateUser
export const createValidation = [
  body("email").not().isEmpty().withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email address is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({
      min: 4,
      max: 16,
    })
    .withMessage("Password must be between 4 to 16 characters")
    .matches(/^(?=.*[a-z])(?!.* )(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage("Must contains upper case, lower case, digit, special character"),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and Confirm password does not match");
      }
      return true;
    }),
  body("firstName").not().isEmpty()
    .withMessage("First name is required")
    .matches("^[a-zA-Z_]*$")
    .withMessage("Invalid firstname , use only alphabet & underscore"),
  body("lastName").not().isEmpty()
    .withMessage("Last name is required")
    .matches("^[a-zA-Z_]*$")
    .withMessage("Invalid lastname , use only alphabet & underscore"),
  body("phone").not().isEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 }).withMessage("Incorrect phone number"),
];

//  Change password
export const changePasswordValidation = [
  body("currentPassword")
    .not()
    .isEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .not()
    .isEmpty()
    .withMessage("New password is required")
    .isLength({
      min: 4,
      max: 16,
    })
    .withMessage("Password must be between 4 to 16 characters")
    .matches(/^(?=.*[a-z])(?!.* )(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage("Must contains upper case, lower case, digit, special character")
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error("Current password and New password cannot be same");
      }
      return true;
    }),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Password and Confirm password does not match");
      }
      return true;
    }),
];

//  updateUser
export const updateUserValidation = [
  body("email").not().isEmpty().withMessage("Email is required")
    .isEmail()
    .withMessage("Valid email address is required"),
  body("password")
    .not()
    .isEmpty()
    .withMessage("password is required")
    .isLength({
      min: 4,
      max: 16,
    })
    .withMessage("Password must be between 4 to 16 characters")
    .matches(/^(?=.*[a-z])(?!.* )(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
    .withMessage("Must contains upper case, lower case, digit, special character"),
  body("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and Confirm password does not match");
      }
      return true;
    }),
  body("firstName").not().isEmpty()
    .withMessage("First name is required")
    .matches("^[a-zA-Z_]*$")
    .withMessage("Invalid firstname use only alphabet & underscore"),
  body("lastName").not().isEmpty()
    .withMessage("Last name is required")
    .matches("^[a-zA-Z_]*$")
    .withMessage("Invalid lastname use only alphabet & underscore"),
  body("phone").not().isEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 }).withMessage("Incorrect phone number"),
];
