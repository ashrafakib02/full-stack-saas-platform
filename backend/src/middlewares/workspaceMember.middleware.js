import prisma from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";

export const requireWorkspaceMember = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;

    const membership = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId: req.user.id,
          workspaceId,
        },
      },
    });

    if (!membership) {
      throw new ApiError(403, "You are not a member of this workspace");
    }

    req.membership = membership;
    next();
  } catch (error) {
    next(error);
  }
};