import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import workspaceRoutes from "../modules/workspace/workspace.routes.js";
import activityRoutes from "../modules/activity/activity.routes.js";
import dashboardRoutes from "../modules/dashboard/dashboard.routes.js";
import projectRoutes from "../modules/project/project.routes.js";
import taskRoutes from "../modules/task/task.routes.js";

const router = Router();

// health route under /api/v1
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/workspaces", workspaceRoutes);
router.use("/activities", activityRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);


export default router;