import express from 'express';
const router = express.Router();

import validateRequest from "../middleware/validateRequest.middleware";
import { createUser, login, changePassword } from "../controllers/user.controller";
import authMiddleware from "../middleware/auth.middleware";
import { createValidation, loginValidation, changePasswordValidation, updateUserValidation } from "../validators/user.validator";

// User routes 
router.post("/create", authMiddleware, createValidation, validateRequest, createUser);
router.post("/login", loginValidation, validateRequest, login);
router.post("/change-password", [authMiddleware, changePasswordValidation, validateRequest], changePassword)

// router.delete(userRoutes.logout.path, [authMiddleware], userController.logout)
// router.patch(userRoutes.update.path, [authMiddleware, userValidator.updateUser(), validateRequest], userController.updateUser)

export default router;
