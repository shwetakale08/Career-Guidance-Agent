import axiosInstance from './axiosInstance';

export const getAllCareers = () =>
  axiosInstance.get('/careers');

export const getCareerById = (id) =>
  axiosInstance.get(`/careers/${id}`);

export const searchCareers = (keyword) =>
  axiosInstance.get(`/careers/search?keyword=${keyword}`);

export const getRecommendations = () =>
  axiosInstance.get('/user/recommendations');

export const getSkillGap = (careerId) =>
  axiosInstance.get(`/user/skill-gap/${careerId}`);