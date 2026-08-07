import axiosInstance from './axiosInstance';

export const registerUser = (data) =>
  axiosInstance.post('/auth/register', data);

export const loginUser = (data) =>
  axiosInstance.post('/auth/login', data);

export const forgotPassword = (email) =>
  axiosInstance.post('/auth/forgot-password', { email });

export const resetPassword = (token, newPassword) =>
  axiosInstance.post('/auth/reset-password', { token, newPassword });

export const validateResetToken = (token) =>
  axiosInstance.get(`/auth/validate-token?token=${token}`);

export const verifyEmail = (token) =>
  axiosInstance.get(`/auth/verify-email?token=${token}`);

export const resendVerification = (email) =>
  axiosInstance.post('/auth/resend-verification', { email });