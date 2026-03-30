import { Router } from "express";
import {
  createProject,
  getWorkspaceProjects,
  updateProject,
  deleteProject,
} from "./project.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeWorkspaceRole } from "../../middlewares/authorizeRole.middleware.js";
import { requireWorkspaceMember } from "../../middlewares/workspaceMember.middleware.js";

const router = Router({ mergeParams: true });

router.post(
  "/",
  authenticate,
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  createProject
);

router.get(
  "/",
  authenticate,
  requireWorkspaceMember,
  getWorkspaceProjects
);

router.patch(
  "/:projectId",
  authenticate,
  authorizeWorkspaceRole("OWNER", "ADMIN"),
  updateProject
);

router.delete(
  "/:projectId",
  authenticate,
  authorizeWorkspaceRole("OWNER"),
  deleteProject
);

export default router;