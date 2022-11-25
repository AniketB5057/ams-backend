import express from 'express';
const router = express.Router();
import { createValidation, updateValidation } from '../validators/category.validator';
import { createCategory, categoryDetails, category, deleteCategory, updateCategory , categoryCombos } from "../controllers/category.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// Category routes 
router.post("/create", [authMiddleware, createValidation, validateRequest], createCategory);

router.get("/", authMiddleware, categoryDetails);
router.get("/item-list", authMiddleware, categoryCombos);
router.get("/:id", authMiddleware, category);

router.delete("/:id", authMiddleware, deleteCategory)

router.put("/:id", [authMiddleware, updateValidation, validateRequest], updateCategory)

export default router;

