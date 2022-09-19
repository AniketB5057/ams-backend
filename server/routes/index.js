import express from "express";
const router = express.Router();
import { moduleRoutes } from "./app.routes";

// Routes files

import UserRoutes from "./user.routes";
router.use("/user", UserRoutes);

import CategoryRoutes from "./category.routes";
router.use("/category", CategoryRoutes);

import DepartmentRoutes from "./department.routes";
router.use("/department", DepartmentRoutes);

// Redirect when no route matches (Wildcard)
router.use('/*', (req, res, next) => {
  next({ status: 404, message: "The page not found!" });
});

export default router;
