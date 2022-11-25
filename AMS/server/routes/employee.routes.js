import express from 'express';
const router = express.Router();
import { createValidation, updateValidation, assignItem } from '../validators/employee.validator';
import { createEmployee, employeeDetails, employee, updateEmployee, deleteEmployee, assignItems, comboDetails, itemassign, assignDetails, updateAssignItem } from "../controllers/employee.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// employee routes // 

router.post("/create", [authMiddleware, createValidation, validateRequest], createEmployee);
router.post("/assign-items", [authMiddleware, assignItem, validateRequest], assignItems);
router.get("/combo-details/:employeeId", comboDetails);

router.get("/", authMiddleware, employeeDetails);
router.get("/getemployee/:id", employee);

router.get("/:id", itemassign); // get from assign item 
router.get("/assignitem/getall", assignDetails);
router.put("/assignitem/:id", [authMiddleware, assignItem, validateRequest], updateAssignItem);

router.put("/:id", [authMiddleware, updateValidation, validateRequest], updateEmployee);
router.delete("/:id", authMiddleware, deleteEmployee);



export default router;

