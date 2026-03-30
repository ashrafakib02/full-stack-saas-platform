import { asyncHandler } from "../../utils/asyncHandler.js";
import { getWorkspaceDashboardStats } from "./dashboard.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const stats = await getWorkspaceDashboardStats(workspaceId);

  return apiResponse(res, {
    statusCode: 200,
    message: "Dashboard stats fetched",
    data: stats,
  });
});