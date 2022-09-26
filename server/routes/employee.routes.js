import express from 'express';
const router = express.Router();
import { createValidation, updateValidation } from '../validators/employee.validator';
import { createEmployee, employeeDetails, employee, updateEmployee, deleteEmployee, assignItems, comboDetails } from "../controllers/employee.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// employee routes // 

router.post("/create", [authMiddleware, createValidation, validateRequest], createEmployee);
router.post("/assign-items", authMiddleware, assignItems);
router.get("/combo-details/:employeeId", authMiddleware, comboDetails);

router.get("/", authMiddleware, employeeDetails);
router.get("/:id", authMiddleware, employee);


router.put("/:id", [authMiddleware, updateValidation, validateRequest], updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);

export default router;

