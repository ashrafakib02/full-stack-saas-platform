import { Router } from "express";
import {
  createWorkspace,
  getUserWorkspaces,
} from "./workspace.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createWorkspace);
router.get("/", authenticate, getUserWorkspaces);

export default router;