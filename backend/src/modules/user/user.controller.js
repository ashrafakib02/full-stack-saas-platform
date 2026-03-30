import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res, next) => {
  return apiResponse(res, {
    statusCode: 200,
    message: "User profile fetched",
    data: req.user,
  });
});
