import { Router } from "express";
import { getActivities } from "./activity.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireWorkspaceMember } from "../../middlewares/workspaceMember.middleware.js";

const router = Router({ mergeParams: true });

router.get("/", authenticate, requireWorkspaceMember, getActivities);

export default router;