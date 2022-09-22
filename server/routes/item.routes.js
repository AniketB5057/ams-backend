import express from 'express';
const router = express.Router();
import { createItem } from '../validators/item.validator';
import itemController from "../controllers/item.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// employee routes // 

router.post("/create", [createItem(), validateRequest], itemController.createItem);

router.get("/", itemController.itemDetails);
router.get("/:id", itemController.itemGet);

router.put("/:id", [createItem(), validateRequest], itemController.updateItem);

router.delete("/:id", itemController.deleteItem);

export default router;

