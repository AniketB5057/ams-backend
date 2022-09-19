import express from 'express';
const router = express.Router();
import { createDepartment } from '../validators/department.validator';
import categoryController from "../controllers/department.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// Company routes // 

router.post("/create", [createDepartment(), validateRequest], categoryController.createDepartment);

// router.get("/", categoryController.categoryDetails);
// router.get("/list", categoryController.categoryList);
// router.get("/stock", categoryController.generateStock);

// router.get("/:id", categoryController.categoryProfile);
// router.delete("/:id", categoryController.deleteCategory)


export default router;

