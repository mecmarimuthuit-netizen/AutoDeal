import API from "./api";

export const registerUser = async (data) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await API.post("/auth/verify-otp", data);
  return response.data;
};

export const forgotPassword = async (data) => {
  const response = await API.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data) => {
  const response = await API.post("/auth/reset-password", data);
  return response.data;
};

export const refreshToken = async (data) => {
  const response = await API.post("/auth/refresh-token", data);
  return response.data;
};
