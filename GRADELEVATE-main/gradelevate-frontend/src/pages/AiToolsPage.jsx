import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getAllAiTools, searchAiTools, filterAiTools } from '../api/aiToolsApi';
import { Cpu, Search, ArrowLeft, TrendingUp, Briefcase, BookOpen, FileText, LogOut, ExternalLink } from 'lucide-react';

const CATEGORIES = ['All', 'Writing', 'Coding', 'Design', 'Research', 'Productivity', 'Image', 'Video', 'Data'];
const PRICING = ['All', 'FREE', 'FREEMIUM', 'PAID'];

const AiToolsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [tools, setTools] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePricing, setActivePricing] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState(null);

  useEffect(() => { fetchTools(); }, []);

  const fetchTools = async () => {
    try {
      const res = await getAllAiTools();
      setTools(res.data);
    } catch {
      toast.error('Failed to load AI tools');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setKeyword(val);
    setActiveCategory('All');
    setActivePricing('All');
    if (val.trim().length < 2) { fetchTools(); return; }
    try {
      const res = await searchAiTools(val);
      setTools(res.data);
    } catch {
      toast.error('Search failed');
    }
  };

  const handleFilter = async (category, pricing) => {
    setLoading(true);
    setKeyword('');
    try {
      const cat = category === 'All' ? null : category;
      const pri = pricing === 'All' ? null : pricing;
      const res = await filterAiTools(cat, pri);
      setTools(res.data);
    } catch {
      toast.error('Failed to filter tools');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    handleFilter(cat, activePricing);
  };

  const handlePricingChange = (pricing) => {
    setActivePricing(pricing);
    handleFilter(activeCategory, pricing);
  };

  const getPricingColor = (type) => {
    if (type === 'FREE') return 'bg-green-100 text-green-700';
    if (type === 'FREEMIUM') return 'bg-blue-100 text-blue-700';
    if (type === 'PAID') return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { label: 'Careers', icon: Briefcase, path: '/careers' },
    { label: 'Skills', icon: BookOpen, path: '/skills' },
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
            <h2 className="text-2xl font-bold text-gray-800">AI Tools Directory</h2>
            <p className="text-gray-500 text-sm">Discover AI tools to supercharge your workflow</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={handleSearch}
            placeholder="Search AI tools..."
            className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white shadow-sm"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 self-center mr-1">Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-500 self-center mr-1">Pricing:</span>
            {PRICING.map((p) => (
              <button
                key={p}
                onClick={() => handlePricingChange(p)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${activePricing === p ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">

          {/* Tools grid */}
          <div className={selectedTool ? 'w-3/5' : 'w-full'}>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tools.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No AI tools found.</div>
            ) : (
              <div className={`grid gap-4 ${selectedTool ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {tools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => setSelectedTool(tool)}
                    className={`bg-white rounded-xl p-4 shadow-sm border cursor-pointer transition group ${selectedTool?.id === tool.id ? 'border-indigo-500 shadow-md' : 'border-gray-100 hover:border-indigo-300 hover:shadow-md'}`}
                  >
                    {/* Logo or placeholder */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-3">
                      <Cpu size={20} className="text-white" />
                    </div>

                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-800 text-sm group-hover:text-indigo-600 transition">{tool.name}</h3>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ml-1 ${getPricingColor(tool.pricingType)}`}>
                        {tool.pricingType}
                      </span>
                    </div>

                    <p className="text-gray-500 text-xs line-clamp-2 mb-2">{tool.description}</p>

                    {tool.category && (
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{tool.category}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tool detail panel */}
          {selectedTool && (
            <div className="w-2/5">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">

                {/* Tool header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Cpu size={22} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{selectedTool.name}</h3>
                      {selectedTool.category && (
                        <span className="text-xs text-gray-500">{selectedTool.category}</span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => setSelectedTool(null)} className="text-gray-400 hover:text-gray-600 transition text-lg font-bold">
                    X
                  </button>
                </div>

                {/* Pricing badge */}
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${getPricingColor(selectedTool.pricingType)}`}>
                  {selectedTool.pricingType}
                </span>

                {/* Description */}
                {selectedTool.description && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">About</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{selectedTool.description}</p>
                  </div>
                )}

                {/* Use case */}
                {selectedTool.useCase && (
                  <div className="mb-5">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">When to use</h4>
                    <p className="text-gray-700 text-sm leading-relaxed bg-indigo-50 p-3 rounded-lg">{selectedTool.useCase}</p>
                  </div>
                )}

                {/* Visit button */}
                {selectedTool.websiteUrl && (
                  <a href={selectedTool.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl transition text-sm">
                    <ExternalLink size={16} />
                    Visit {selectedTool.name}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AiToolsPage;