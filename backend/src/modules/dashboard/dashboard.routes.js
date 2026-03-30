import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireWorkspaceMember } from "../../middlewares/workspaceMember.middleware.js";

const router = Router({ mergeParams: true });

router.get("/", authenticate, requireWorkspaceMember, getDashboardStats);

export default router;