import { asyncHandler } from "../../utils/asyncHandler.js";
import { getWorkspaceActivities } from "./activity.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export const getActivities = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const activities = await getWorkspaceActivities(workspaceId);

  return apiResponse(res, {
    statusCode: 200,
    message: "Activities fetched",
    data: activities,
  });
});