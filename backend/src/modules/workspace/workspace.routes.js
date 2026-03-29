import { Router } from "express";
import {
  createWorkspace,
  getUserWorkspaces,
  addWorkspaceMember,
  getWorkspaceMembers,
} from "./workspace.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorizeWorkspaceRole } from "../../middlewares/authorizeRole.middleware.js";

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

export default router;