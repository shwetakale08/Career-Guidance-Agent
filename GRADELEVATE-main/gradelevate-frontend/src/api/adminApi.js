import axiosInstance from './axiosInstance';

export const getAdminStats    = () => axiosInstance.get('/admin/stats');

export const adminGetCareers  = () => axiosInstance.get('/admin/careers');
export const adminCreateCareer = (data) => axiosInstance.post('/admin/careers', data);
export const adminUpdateCareer = (id, data) => axiosInstance.put(`/admin/careers/${id}`, data);
export const adminDeleteCareer = (id) => axiosInstance.delete(`/admin/careers/${id}`);
export const adminAddSkillToCareer = (careerId, skillId) => axiosInstance.post(`/admin/careers/${careerId}/skills/${skillId}`);
export const adminRemoveSkillFromCareer = (careerId, skillId) => axiosInstance.delete(`/admin/careers/${careerId}/skills/${skillId}`);

export const adminGetSkills   = () => axiosInstance.get('/admin/skills');
export const adminCreateSkill = (data) => axiosInstance.post('/admin/skills', data);
export const adminUpdateSkill = (id, data) => axiosInstance.put(`/admin/skills/${id}`, data);
export const adminDeleteSkill = (id) => axiosInstance.delete(`/admin/skills/${id}`);

export const adminGetResources   = () => axiosInstance.get('/admin/resources');
export const adminCreateResource = (data) => axiosInstance.post('/admin/resources', data);
export const adminDeleteResource = (id) => axiosInstance.delete(`/admin/resources/${id}`);

export const adminGetAiTools    = () => axiosInstance.get('/admin/ai-tools');
export const adminCreateAiTool  = (data) => axiosInstance.post('/admin/ai-tools', data);
export const adminUpdateAiTool  = (id, data) => axiosInstance.put(`/admin/ai-tools/${id}`, data);
export const adminDeleteAiTool  = (id) => axiosInstance.delete(`/admin/ai-tools/${id}`);