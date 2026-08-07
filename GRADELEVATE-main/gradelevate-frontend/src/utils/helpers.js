export const getYoutubeThumbnail = (url) => {
  if (!url) return null;

  // Handle youtu.be short links
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) {
    return `https://img.youtube.com/vi/${shortMatch[1]}/hqdefault.jpg`;
  }

  // Handle youtube.com/watch?v=
  const longMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (longMatch) {
    return `https://img.youtube.com/vi/${longMatch[1]}/hqdefault.jpg`;
  }

  // Handle youtube.com/embed/
  const embedMatch = url.match(/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) {
    return `https://img.youtube.com/vi/${embedMatch[1]}/hqdefault.jpg`;
  }

  // Playlist URL — no thumbnail available
  return null;
};

export const isYoutubeUrl = (url) => {
  return url && (url.includes('youtube.com') || url.includes('youtu.be'));
};

export const getResourceColor = (type) => {
  if (type === 'VIDEO') return 'bg-red-500';
  if (type === 'PLAYLIST') return 'bg-orange-500';
  if (type === 'GITHUB_REPO') return 'bg-gray-800';
  if (type === 'ARTICLE') return 'bg-blue-500';
  if (type === 'COURSE') return 'bg-green-500';
  return 'bg-indigo-500';
};

export const getResourceLabel = (type) => {
  if (type === 'VIDEO') return 'VIDEO';
  if (type === 'PLAYLIST') return 'PLAYLIST';
  if (type === 'GITHUB_REPO') return 'GITHUB';
  if (type === 'ARTICLE') return 'ARTICLE';
  if (type === 'COURSE') return 'COURSE';
  return 'LINK';
};