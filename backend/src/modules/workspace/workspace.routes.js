import { Router } from "express";
import {
  createWorkspace,
  getUserWorkspaces,
  addWorkspaceMember,
  getWorkspaceMembers,
  updateWorkspaceMemberRole,
  removeWorkspaceMember,
} from "./workspace.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeWorkspaceRole } from "../../middlewares/authorizeRole.middleware.js";
import projectRoutes from "../project/project.routes.js";
import taskRoutes from "../task/task.routes.js";
import activityRoutes from "../activity/activity.routes.js";

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
router.patch(
  "/:workspaceId/members/:memberUserId/role",
  authenticate,
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  updateWorkspaceMemberRole
);

router.delete(
  "/:workspaceId/members/:memberUserId",
  authenticate,
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  removeWorkspaceMember
);
router.use("/:workspaceId/projects", projectRoutes);
router.use("/:workspaceId/tasks", taskRoutes);
router.use("/:workspaceId/activities", activityRoutes);

export default router;