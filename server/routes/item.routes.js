import express from 'express';
const router = express.Router();
import { createItemValidation } from '../validators/item.validator';
import { createItem, itemDetails, singleItem, updateItem, deleteItem, assetItem } from "../controllers/item.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// employee routes // 

router.post("/create", [authMiddleware, createItem, validateRequest], createItem);

router.get("/", authMiddleware, itemDetails);
router.get("/:id", authMiddleware, singleItem);

router.put("/:id", [authMiddleware, updateItem, validateRequest], updateItem);

router.delete("/:id", authMiddleware, deleteItem);

export default router;

