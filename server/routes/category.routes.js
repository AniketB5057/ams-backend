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
router.get("/list", categoryController.categoryList);
router.get("/stock", categoryController.generateStock);

router.get("/:id", categoryController.categoryProfile);

router.patch("/status/:id", [authMiddleware, validateRequest], categoryController.changestatus)
router.patch("/:id", [updateCategory(), validateRequest], categoryController.updateCategory)

router.delete("/", [authMiddleware, validateRequest], categoryController.multipleDeleteCategory)
router.delete("/:id", categoryController.deleteCategory)

export default router;

