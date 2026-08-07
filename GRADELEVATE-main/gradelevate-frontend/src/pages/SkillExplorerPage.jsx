import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAllSkills, searchSkills, getSkillsByCategory } from '../api/skillApi';
import { getResourcesBySkill } from '../api/resourceApi';
import { BookOpen, Search, ArrowLeft, TrendingUp, Briefcase, Cpu, FileText, LogOut, ExternalLink } from 'lucide-react';

const CATEGORIES = ['All', 'Programming', 'Design', 'Finance', 'Marketing', 'Data', 'Business', 'Communication'];

const SkillExplorerPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [skills, setSkills] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [resources, setResources] = useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);

  useEffect(() => { fetchSkills(); }, []);

  const fetchSkills = async () => {
    try {
      const res = await getAllSkills();
      setSkills(res.data);
    } catch {
      toast.error('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setKeyword(val);
    setActiveCategory('All');
    if (val.trim().length < 2) { fetchSkills(); return; }
    try {
      const res = await searchSkills(val);
      setSkills(res.data);
    } catch {
      toast.error('Search failed');
    }
  };

  const handleCategoryFilter = async (category) => {
    setActiveCategory(category);
    setKeyword('');
    setLoading(true);
    try {
      if (category === 'All') {
        const res = await getAllSkills();
        setSkills(res.data);
      } else {
        const res = await getSkillsByCategory(category);
        setSkills(res.data);
      }
    } catch {
      toast.error('Failed to filter skills');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSkill = async (skill) => {
    setSelectedSkill(skill);
    setResources([]);
    setResourceLoading(true);
    try {
      const res = await getResourcesBySkill(skill.id);
      setResources(res.data);
    } catch {
      toast.error('Failed to load resources');
    } finally {
      setResourceLoading(false);
    }
  };

  const getResourceLabel = (type) => {
    if (type === 'VIDEO') return 'VIDEO';
    if (type === 'PLAYLIST') return 'LIST';
    if (type === 'GITHUB_REPO') return 'REPO';
    if (type === 'ARTICLE') return 'READ';
    if (type === 'COURSE') return 'COURSE';
    return 'LINK';
  };

  const getResourceColor = (type) => {
    if (type === 'VIDEO') return 'bg-red-100 text-red-600';
    if (type === 'PLAYLIST') return 'bg-orange-100 text-orange-600';
    if (type === 'GITHUB_REPO') return 'bg-gray-100 text-gray-700';
    if (type === 'ARTICLE') return 'bg-blue-100 text-blue-600';
    if (type === 'COURSE') return 'bg-green-100 text-green-600';
    return 'bg-indigo-100 text-indigo-600';
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { label: 'Careers', icon: Briefcase, path: '/careers' },
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
            <h2 className="text-2xl font-bold text-gray-800">Skill Explorer</h2>
            <p className="text-gray-500 text-sm">Browse skills and find learning resources</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={handleSearch}
            placeholder="Search skills..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          />
        </div>

        {/* Category filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-6">

          {/* Skills list */}
          <div className={selectedSkill ? 'w-2/5' : 'w-full'}>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : skills.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No skills found.</div>
            ) : (
              <div className={`grid gap-3 ${selectedSkill ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => navigate(`/skills/${skill.id}`)}
                    className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition group ${selectedSkill?.id === skill.id ? 'border-indigo-500 shadow-md' : 'border-gray-100 hover:border-indigo-300'}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <BookOpen size={16} className="text-indigo-600" />
                      </div>
                      {skill.category && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{skill.category}</span>
                      )}
                    </div>
                      <button
                        onClick={() => navigate(`/skills/${skill.id}`)}
                        className="font-semibold text-gray-800 text-sm hover:text-indigo-600 transition text-left"
                      >
                        {skill.name}
                      </button>                    {skill.description && (
                      <p className="text-gray-500 text-xs line-clamp-2">{skill.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Resources panel */}
          {selectedSkill && (
            <div className="w-3/5">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <BookOpen size={18} className="text-indigo-500" />
                      <button
                        onClick={() => navigate(`/skills/${skill.id}`)}
                        className="font-semibold text-gray-800 text-sm hover:text-indigo-600 transition text-left"
                      >
                        {skill.name}
                      </button>
                    </div>
                    {selectedSkill.category && (
                      <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-0.5 rounded-full">{selectedSkill.category}</span>
                    )}
                    {selectedSkill.description && (
                      <p className="text-gray-500 text-sm mt-2">{selectedSkill.description}</p>
                    )}
                  </div>
                  <button onClick={() => setSelectedSkill(null)} className="text-gray-400 hover:text-gray-600 transition ml-4 text-lg font-bold">
                    X
                  </button>
                </div>

                <h4 className="font-semibold text-gray-700 mb-3 text-sm">Learning Resources</h4>

                {resourceLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : resources.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No resources added yet for this skill.</p>
                  </div>
                ) : (
                  <div className="space-y-3 overflow-y-auto max-h-96">
                    {resources.map((res) => (
                      <a key={res.id} href={res.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 transition group">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 ${getResourceColor(res.type)}`}>
                          {getResourceLabel(res.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-sm group-hover:text-indigo-600 transition line-clamp-1">{res.title}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{res.url}</p>
                        </div>
                        <ExternalLink size={14} className="text-gray-300 group-hover:text-indigo-500 transition flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillExplorerPage;