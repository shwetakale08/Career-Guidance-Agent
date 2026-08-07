import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getSmartRecommendations } from '../api/profileApi';
import { getProfile } from '../api/profileApi';
import { Briefcase, BookOpen, Cpu, FileText, LogOut, TrendingUp, ChevronRight, User, ShieldCheck } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Try to get profile first
      try {
        const profileRes = await getProfile();
        setProfile(profileRes.data);
      } catch {
        // No profile yet — that's fine, show empty dashboard
        setProfile(null);
      }

      // Try to get smart recommendations (same as onboarding)
      try {
        const recRes = await getSmartRecommendations();
        setRecommendations(recRes.data);
      } catch {
        // No recommendations yet — that's fine
        setRecommendations([]);
      }

    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDemandColor = (level) => {
    if (level === 'VERY_HIGH') return 'bg-green-100 text-green-700';
    if (level === 'HIGH') return 'bg-blue-100 text-blue-700';
    if (level === 'MEDIUM') return 'bg-yellow-100 text-yellow-700';
    if (level === 'LOW') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    return 'text-yellow-600';
  };

  const navItems = [
    { label: 'Careers', icon: Briefcase, path: '/careers' },
    { label: 'Skills', icon: BookOpen, path: '/skills' },
    { label: 'AI Tools', icon: Cpu, path: '/ai-tools' },
    { label: 'Resume', icon: FileText, path: '/resume' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600">AI Career Guidance Agent</h1>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 font-medium transition">
              <item.icon size={16} />{item.label}
            </Link>
          ))}
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition">
              <ShieldCheck size={16} />Admin
            </Link>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={16} />
            <span>{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition">
            <LogOut size={16} />Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-2xl font-bold mb-1">Welcome back!</h2>
          <p className="text-indigo-200">
            {profile
              ? 'Here are your personalized career recommendations based on your profile.'
              : 'Complete your onboarding to get personalized career recommendations.'}
          </p>
          {profile?.interestAreas && (
            <div className="flex flex-wrap gap-2 mt-4">
              {profile.interestAreas.split(',').map((tag) => (
                <span key={tag} className="bg-white bg-opacity-20 text-white text-xs px-3 py-1 rounded-full capitalize">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Career Matches', value: recommendations.length, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50', path: null },
            { label: 'Top Match Score', value: recommendations[0] ? `${recommendations[0].matchScore}%` : '—', icon: Briefcase, color: 'text-green-600', bg: 'bg-green-50', path: null },
            { label: 'Explore Skills', value: 'Browse', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50', path: '/skills' },
            { label: 'Analyze Resume', value: 'Upload', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50', path: '/resume' },
          ].map((stat) => (
            <div
              key={stat.label}
              onClick={() => stat.path && navigate(stat.path)}
              className={`bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 ${stat.path ? 'cursor-pointer hover:shadow-md transition' : ''}`}
            >
              <div className={`${stat.bg} p-3 rounded-lg`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.label}</p>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Career Recommendations */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Your Career Recommendations</h3>
            <Link to="/careers" className="text-sm text-indigo-600 hover:underline font-medium flex items-center gap-1">
              Explore all careers <ChevronRight size={16} />
            </Link>
          </div>

          {recommendations.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={28} className="text-indigo-400" />
              </div>
              <p className="text-gray-600 font-semibold mb-2">No recommendations yet</p>
              <p className="text-gray-400 text-sm mb-4">Complete your onboarding to get personalized career matches</p>
              <button
                onClick={() => navigate('/onboarding')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.int5 rounded-xl transition text-sm"
              >
                Start Onboarding
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.slice(0, 3).map((career) => (
                <div
                  key={career.careerId}
                  onClick={() => navigate(`/careers/${career.careerId}`)}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-2xl font-bold ${getScoreColor(career.matchScore)}`}>
                      {career.matchScore}%
                    </span>
                    {career.demandLevel && (
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getDemandColor(career.demandLevel)}`}>
                        {career.demandLevel.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition mb-1">
                    {career.careerTitle}
                  </h4>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-3">{career.description}</p>
                  {career.avgSalary && (
                    <p className="text-xs text-gray-400">
                      Avg salary: <span className="font-medium text-gray-600">{career.avgSalary}</span>
                    </p>
                  )}
                  <div className="flex justify-end mt-3">
                    <ChevronRight size={18} className="text-gray-300 group-hover:text-indigo-500 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick navigation cards */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Explore AI Career Guidance Agent</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Career Explorer', desc: 'Browse all careers', icon: Briefcase, color: 'bg-indigo-600', path: '/careers' },
              { label: 'Skill Explorer', desc: 'Learn what skills you need', icon: BookOpen, color: 'bg-blue-600', path: '/skills' },
              { label: 'AI Tools', desc: 'Discover AI tools', icon: Cpu, color: 'bg-purple-600', path: '/ai-tools' },
              { label: 'Resume Analyzer', desc: 'Get AI feedback', icon: FileText, color: 'bg-green-600', path: '/resume' },
            ].map((card) => (
              <div
                key={card.path}
                onClick={() => navigate(card.path)}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group"
              >
                <div className={`${card.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                  <card.icon size={20} className="text-white" />
                </div>
                <p className="font-semibold text-gray-800 text-sm group-hover:text-indigo-600 transition">{card.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage; 