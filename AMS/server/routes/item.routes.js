import express from 'express';
const router = express.Router();
import { createItemValidation, updateItemValidation } from '../validators/item.validator';
import { createItem, itemDetails, singleItem, updateItem, deleteItem, assetItem } from "../controllers/item.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// employee routes // 

router.post("/create", [authMiddleware, createItemValidation, validateRequest], createItem);

router.get("/", authMiddleware, itemDetails);
router.get("/:id", authMiddleware, singleItem);

router.put("/:id", [authMiddleware, updateItemValidation, validateRequest], updateItem);

router.delete("/:id", authMiddleware, deleteItem);

export default router;

