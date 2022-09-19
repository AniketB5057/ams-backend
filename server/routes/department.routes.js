import express from 'express';
const router = express.Router();
import { createDepartment, updateDepartment } from '../validators/department.validator';
import departmentController from "../controllers/department.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// Company routes // 

router.post("/create", [createDepartment(), validateRequest], departmentController.createDepartment);
router.put("/:id", [updateDepartment(), validateRequest], departmentController.updateController);
router.get("/getall", departmentController.getallDepartment);
router.get("/:id", departmentController.getDepartment);
router.delete("/:id", departmentController.deleteDepartment);




export default router;

