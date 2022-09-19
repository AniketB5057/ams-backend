import express from 'express';
const router = express.Router();
import { createemployee } from '../validators/employee.validator';
import employeeController from "../controllers/employee.controller";
import validateRequest from "../middleware/validateRequest.middleware";
import authMiddleware from "../middleware/auth.middleware";

// employee routes // 

router.post("/create", [createemployee(), validateRequest], employeeController.createemployee);


export default router;

