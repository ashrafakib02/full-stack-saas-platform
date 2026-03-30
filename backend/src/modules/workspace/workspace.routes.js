import { Router } from "express";
import {
  createWorkspace,
  getUserWorkspaces,
  addWorkspaceMember,
  getWorkspaceMembers,
} from "./workspace.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeWorkspaceRole } from "../../middlewares/authorizeRole.middleware.js";
import projectRoutes from "../project/project.routes.js";
import taskRoutes from "../task/task.routes.js";

const router = Router();

router.post("/", authenticate, createWorkspace);
router.get("/", authenticate, getUserWorkspaces);

router.post(
  "/:workspaceId/members",
  authenticate,
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  addWorkspaceMember
);

router.get(
  "/:workspaceId/members",
  authenticate,
  authorizeWorkspaceRole("OWNER", "ADMIN", "MEMBER"),
  getWorkspaceMembers
);

router.use("/:workspaceId/projects", projectRoutes);
router.use("/:workspaceId/tasks", taskRoutes);

export default router;