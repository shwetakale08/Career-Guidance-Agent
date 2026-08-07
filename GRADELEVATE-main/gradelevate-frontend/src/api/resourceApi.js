import axiosInstance from './axiosInstance';

export const getResourcesBySkill = (skillId) =>
  axiosInstance.get(`/resources/skill/${skillId}`);

export const getResourcesByCareer = (careerId) =>
  axiosInstance.get(`/resources/career/${careerId}`);