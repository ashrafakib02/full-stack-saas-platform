import { registerUser, loginUser, refreshAccessToken } from "./auth.service.js";
import { apiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

export const register = asyncHandler(async (req, res, next) => {
  const result = await registerUser(req.body);

  return apiResponse(res, {
    statusCode: 201,
    message: "User registered successfully",
    data: result,
  });
});
export const login = asyncHandler(async (req, res, next) => {
  const result = await loginUser(req.body);

  return apiResponse(res, {
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});
export const refreshToken = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  const result = await refreshAccessToken(refreshToken);

  return apiResponse(res, {
    statusCode: 200,
    message: "Token refreshed",
    data: result,
  });
});
export const logout = asyncHandler(async (req, res, next) => {
  return apiResponse(res, {
    statusCode: 200,
    message: "Logged out successfully",
    data: null,
  });
});
