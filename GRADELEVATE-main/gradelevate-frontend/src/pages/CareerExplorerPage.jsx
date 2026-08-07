import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAllCareers, searchCareers } from '../api/careerApi';
import { Briefcase, Search, ChevronRight, ArrowLeft, TrendingUp, BookOpen, LogOut, Cpu, FileText } from 'lucide-react';

const CareerExplorerPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [careers, setCareers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const DEMAND_FILTERS = ['ALL', 'VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'];

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getAllCareers();
        setCareers(res.data);
        const careerId = searchParams.get('careerId');
        if (careerId) {
          navigate(`/careers/${careerId}`);
        }
      } catch {
        toast.error('Failed to load careers');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const fetchCareers = async () => {
    try {
      const res = await getAllCareers();
      setCareers(res.data);
    } catch {
      toast.error('Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setKeyword(val);
    if (val.trim().length < 2) { fetchCareers(); return; }
    try {
      const res = await searchCareers(val);
      setCareers(res.data);
    } catch {
      toast.error('Search failed');
    }
  };

  const getDemandColor = (level) => {
    if (level === 'VERY_HIGH') return 'bg-green-100 text-green-700';
    if (level === 'HIGH') return 'bg-blue-100 text-blue-700';
    if (level === 'MEDIUM') return 'bg-yellow-100 text-yellow-700';
    if (level === 'LOW') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getDemandFilterColor = (level, isActive) => {
    if (!isActive) return 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300';
    if (level === 'ALL') return 'bg-indigo-600 text-white';
    if (level === 'VERY_HIGH') return 'bg-green-600 text-white';
    if (level === 'HIGH') return 'bg-blue-600 text-white';
    if (level === 'MEDIUM') return 'bg-yellow-500 text-white';
    if (level === 'LOW') return 'bg-red-500 text-white';
    return 'bg-gray-600 text-white';
  };

  const filteredCareers = activeFilter === 'ALL'
    ? careers
    : careers.filter(c => c.demandLevel === activeFilter);

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { label: 'Skills', icon: BookOpen, path: '/skills' },
    { label: 'AI Tools', icon: Cpu, path: '/ai-tools' },
    { label: 'Resume', icon: FileText, path: '/resume' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-indigo-600">AI Career Guidance Agent</h1>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-indigo-600 font-medium transition">
              <item.icon size={16} />{item.label}
            </Link>
          ))}
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition">
          <LogOut size={16} />Logout
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 rounded-lg transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Career Explorer</h2>
            <p className="text-gray-500 text-sm">Click any career to see your skill gap and learning roadmap</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={handleSearch}
            placeholder="Search careers..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          />
        </div>

        {/* Demand filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {DEMAND_FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${getDemandFilterColor(filter, activeFilter === filter)}`}
            >
              {filter === 'ALL' ? `All (${careers.length})` : filter.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Very High Demand', count: careers.filter(c => c.demandLevel === 'VERY_HIGH').length, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'High Demand', count: careers.filter(c => c.demandLevel === 'HIGH').length, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Medium Demand', count: careers.filter(c => c.demandLevel === 'MEDIUM').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { label: 'Total Careers', count: careers.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Career grid */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <Briefcase size={40} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium">No careers found</p>
            <button onClick={() => { setKeyword(''); setActiveFilter('ALL'); fetchCareers(); }}
              className="text-indigo-600 text-sm mt-2 hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCareers.map((career) => (
              <div
                key={career.id}
                onClick={() => navigate(`/careers/${career.id}`)}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-300 transition cursor-pointer group"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition">
                    <Briefcase size={18} className="text-indigo-500" />
                  </div>
                  {career.demandLevel && (
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getDemandColor(career.demandLevel)}`}>
                      {career.demandLevel.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Career title */}
                <h3 className="font-bold text-gray-800 text-base group-hover:text-indigo-600 transition mb-1 leading-tight">
                  {career.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
                  {career.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
                  {career.avgSalary ? (
                    <span className="text-xs font-semibold text-gray-600">{career.avgSalary}</span>
                  ) : (
                    <span />
                  )}
                  <div className="flex items-center gap-1 text-indigo-500 text-xs font-semibold group-hover:gap-2 transition-all">
                    View roadmap
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerExplorerPage;