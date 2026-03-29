import prisma from "../config/prisma.js";
import { ApiError } from "../utils/apiError.js";

export const authorizeWorkspaceRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { workspaceId } = req.params;
console.log("req.user.id:", req.user.id);
console.log("workspaceId from params:", req.params.workspaceId);
      const membership = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId: req.user.id,
            workspaceId,
          },
        },
      });
console.log("membership:", membership);
      if (!membership) {
        throw new ApiError(403, "You are not a member of this workspace");
      }

      if (!allowedRoles.includes(membership.role)) {
        throw new ApiError(403, "You do not have permission to perform this action");
      }

      req.membership = membership;
      next();
    } catch (error) {
      next(error);
    }
  };
};