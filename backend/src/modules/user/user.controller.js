import { apiResponse } from "../../utils/apiResponse.js";

export const getProfile = async (req, res, next) => {
  try {
    return apiResponse(res, {
      statusCode: 200,
      message: "User profile fetched",
      data: req.user,
    });
  } catch (error) {
    next(error);
  }
};