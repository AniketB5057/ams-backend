import { body } from "express-validator";
import { get, isEmpty, values } from "lodash";
import models from "../models";
const _ = { get, isEmpty };

export const createItemValidation = [
    body("itemName")
        .not()
        .isEmpty()
        .withMessage("itemName is required"),
    body("description")
        .not()
        .isEmpty()
        .withMessage("description is required"),
    body("serialNo")
        .not()
        .isEmpty()
        .withMessage("serial number is required"),
    body("cost")
        .not()
        .isEmpty()
        .withMessage("cost is required"),
    body("datePurchased")
        .not()
        .isEmpty()
        .withMessage("date purchased is required"),
    body("categoryId")
        .not()
        .isEmpty()
        .withMessage("category Id is required"),
    body("typeOfAsset")
        .not()
        .isEmpty()
        .withMessage("typeOfAsset is required"),
]

export const updateItemValidation = [
    body("itemName")
        .not()
        .isEmpty()
        .withMessage("itemName is required"),
    body("description")
        .not()
        .isEmpty()
        .withMessage("description is required"),
    body("serialNo")
        .not()
        .isEmpty()
        .withMessage("serial number is required"),
    body("cost")
        .not()
        .isEmpty()
        .withMessage("cost is required"),
    body("datePurchased")
        .not()
        .isEmpty()
        .withMessage("date purchased is required"),
    body("categoryId")
        .not()
        .isEmpty()
        .withMessage("category Id is required"),
    body("typeOfAsset")
        .not()
        .isEmpty()
        .withMessage("typeOfAsset is required"),
]  