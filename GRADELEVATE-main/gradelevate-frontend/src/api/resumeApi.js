import axiosInstance from './axiosInstance';

export const uploadResume = (file, jobDescription) => {
  const formData = new FormData();
  formData.append('file', file);
  if (jobDescription && jobDescription.trim()) {
    formData.append('jobDescription', jobDescription.trim());
  }
  return axiosInstance.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getMyResumes = () =>
  axiosInstance.get('/resume/my-resumes');

export const getResumeAnalysis = (resumeId) =>
  axiosInstance.get(`/resume/${resumeId}/analysis`);