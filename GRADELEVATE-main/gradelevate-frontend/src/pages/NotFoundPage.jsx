import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-8xl font-black text-indigo-600 mb-4">404</h1>
        <p className="text-xl font-bold text-gray-800 mb-2">Page not found</p>
        <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl transition">
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
