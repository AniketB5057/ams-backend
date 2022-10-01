import { body } from "express-validator";

export const createValidation = [
    body("email").not().isEmpty().withMessage("Email is required")
        .isEmail()
        .withMessage("Valid email address is required"),
    body("departmentId")
        .not()
        .isEmpty()
        .withMessage("departmentId is required"),
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
        .withMessage("Lirst name is required")
        .matches("^[a-zA-Z_]*$")
        .withMessage("Invalid lirstname , use only alphabet & underscore"),
    body("phone").not().isEmpty()
        .withMessage("Phone number is required")
        .isLength({ min: 10, max: 10 }).withMessage("Incorrect phone number"),
];

export const updateValidation = [
    body("departmentId")
        .not(),
    body("firstName")
        .not(),
    body("lastName")
        .not(),
    body("phone").not()
        .isLength({ min: 10, max: 10 }).withMessage("Incorrect phone number"),
    body("email").not().isEmpty().withMessage("Email is required")
        .isEmail()
        .withMessage("Valid email address is required"),
]

export const assignItem = [
    body("itemIds").not().isEmpty()
        .withMessage("itemId is required"),
    body("remarks").not().isEmpty()
        .withMessage("remarks is required"),
    body("employeeId").not().isEmpty()
        .withMessage("employeeId is required"),
];