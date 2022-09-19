import express from 'express';
const router = express.Router();
import { createCategory, updateCategory } from '../validators/category.validator';
import categoryController from "../controllers/category.controller";
import { categoryRoutes } from "./app.routes";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// Company routes // 

router.post("/create", [createCategory(), validateRequest], categoryController.createCategory); 

router.get("/", categoryController.categoryDetails);
router.get("/:id", categoryController.category);

router.delete("/:id", categoryController.deleteCategory)

router.put("/:id", [updateCategory(), validateRequest], categoryController.updateCategory)

export default router;

