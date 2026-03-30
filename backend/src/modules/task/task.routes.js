import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "./task.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { requireWorkspaceMember } from "../../middlewares/workspaceMember.middleware.js";

const router = Router({ mergeParams: true });

router.post("/", authenticate, requireWorkspaceMember, createTask);
router.get("/", authenticate, requireWorkspaceMember, getTasks);
router.get("/:taskId", authenticate, requireWorkspaceMember, getTaskById);
router.patch("/:taskId", authenticate, requireWorkspaceMember, updateTask);
router.delete("/:taskId", authenticate, requireWorkspaceMember, deleteTask);

export default router;