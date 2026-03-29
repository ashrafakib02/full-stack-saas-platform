import { registerUser, loginUser, refreshAccessToken } from "./auth.service.js";
import { apiResponse } from "../../utils/apiResponse.js";

export const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);

    return apiResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);

    return apiResponse(res, {
      statusCode: 200,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    const result = await refreshAccessToken(refreshToken);

    return apiResponse(res, {
      statusCode: 200,
      message: "Token refreshed",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
export const logout = async (req, res, next) => {
  try {
    return apiResponse(res, {
      statusCode: 200,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};