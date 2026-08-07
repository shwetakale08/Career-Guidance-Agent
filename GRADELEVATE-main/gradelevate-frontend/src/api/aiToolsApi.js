import axiosInstance from './axiosInstance';

export const getAllAiTools = () =>
  axiosInstance.get('/ai-tools');

export const searchAiTools = (keyword) =>
  axiosInstance.get(`/ai-tools/search?keyword=${keyword}`);

export const filterAiTools = (category, pricingType) => {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (pricingType) params.append('pricingType', pricingType);
  return axiosInstance.get(`/ai-tools/filter?${params.toString()}`);
 
};