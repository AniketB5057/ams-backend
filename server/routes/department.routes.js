import express from 'express';
const router = express.Router();
import { createValidation, updateValidation } from '../validators/department.validator';
import { createDepartment, updateController, getallDepartment, getDepartment, deleteDepartment } from "../controllers/department.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// Company routes // 

router.post("/create", [authMiddleware, createValidation, validateRequest], createDepartment);
router.put("/:id", [authMiddleware, updateValidation, validateRequest], updateController);
router.get("/getall", authMiddleware, getallDepartment);
router.get("/:id", authMiddleware, getDepartment);
router.delete("/:id", authMiddleware, deleteDepartment);




export default router;

