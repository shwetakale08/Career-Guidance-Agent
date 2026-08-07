import axiosInstance from './axiosInstance';

export const saveProfile = (data) =>
  axiosInstance.post('/user/profile', data);

export const getProfile = () =>
  axiosInstance.get('/user/profile');

export const getSmartRecommendations = () =>
  axiosInstance.get('/user/smart-recommendations');