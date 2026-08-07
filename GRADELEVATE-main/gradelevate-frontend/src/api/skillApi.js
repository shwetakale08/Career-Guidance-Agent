import axiosInstance from './axiosInstance';

export const getAllSkills = () =>
  axiosInstance.get('/skills');

export const getSkillsByCategory = (category) =>
  axiosInstance.get(`/skills/category/${category}`);

export const searchSkills = (keyword) =>
  axiosInstance.get(`/skills/search?keyword=${keyword}`);