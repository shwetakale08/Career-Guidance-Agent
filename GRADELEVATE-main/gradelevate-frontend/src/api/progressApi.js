import axiosInstance from './axiosInstance';

export const markSkill = (skillId, careerId, status) =>
  axiosInstance.post('/progress/mark', { skillId, careerId, status });

export const unmarkSkill = (skillId, careerId) =>
  axiosInstance.delete('/progress/unmark', {
    data: { skillId, careerId }
  });

export const getCareerReadiness = (careerId) =>
  axiosInstance.get(`/progress/career/${careerId}`);

export const getAllProgress = () =>
  axiosInstance.get('/progress/all');