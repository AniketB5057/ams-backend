import express from 'express';
const router = express.Router();
import { createemployee } from '../validators/employee.validator';
import employeeController from "../controllers/employee.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// employee routes // 

router.post("/create", [createemployee(), validateRequest], employeeController.createemployee);


router.get("/", employeeController.employeeDetails);
router.get("/:id", employeeController.employee);


router.put("/:id", [createemployee(), validateRequest], employeeController.updateemployee);
router.delete("/:id", employeeController.deleteemployee);

export default router;

