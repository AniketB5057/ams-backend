import { body } from "express-validator";

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
        .withMessage("First name is required"),
    body("lastName").not().isEmpty()
        .withMessage("Last name is required"),
    body("phone").not().isEmpty()
        .withMessage("Phone number is required")
        .isLength({ min: 10, max: 10 }).withMessage("Incorrect phone number"),
];

export const updateValidation = [
    body("firstName")
        .not()
        .isEmpty()
        .withMessage("firstName is required"),
]
