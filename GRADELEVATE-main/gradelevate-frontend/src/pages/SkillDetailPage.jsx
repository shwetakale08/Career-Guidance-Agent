import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getResourcesBySkill } from '../api/resourceApi';
import { getAllSkills } from '../api/skillApi';
import { getYoutubeThumbnail, getResourceColor, getResourceLabel } from '../utils/helpers';
import { ArrowLeft, ExternalLink, BookOpen, TrendingUp, Briefcase, Cpu, FileText, LogOut, Play } from 'lucide-react';

const SkillDetailPage = () => {
  const { skillId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [skill, setSkill] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL');

  useEffect(() => { fetchSkillData(); }, [skillId]);

  const fetchSkillData = async () => {
    try {
      const [skillsRes, resourcesRes] = await Promise.all([
        getAllSkills(),
        getResourcesBySkill(skillId),
      ]);
      const found = skillsRes.data.find(s => s.id === Number(skillId));
      setSkill(found);
      setResources(resourcesRes.data);
    } catch {
      toast.error('Failed to load skill');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { label: 'Careers', icon: Briefcase, path: '/careers' },
    { label: 'Skills', icon: BookOpen, path: '/skills' },
    { label: 'AI Tools', icon: Cpu, path: '/ai-tools' },
    { label: 'Resume', icon: FileText, path: '/resume' },
  ];

  const FILTERS = ['ALL', 'VIDEO', 'PLAYLIST', 'GITHUB_REPO', 'ARTICLE', 'COURSE'];
  const filteredResources = activeFilter === 'ALL' ? resources : resources.filter(r => r.type === activeFilter);
  const videos = resources.filter(r => r.type === 'VIDEO' || r.type === 'PLAYLIST');
  const others = resources.filter(r => r.type !== 'VIDEO' && r.type !== 'PLAYLIST');

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!skill) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Skill not found</p>
        <button onClick={() => navigate('/skills')} className="text-indigo-600 font-medium hover:underline">Back to Skills</button>
      </div>
    </div>
  );

  const VideoCard = ({ res }) => {
  const thumbnail = getYoutubeThumbnail(res.url);
  const isPlaylist = res.type === 'PLAYLIST';

  return (
    <a href={res.url} target="_blank" rel="noreferrer" className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-indigo-200 transition group">
      <div className="relative w-full h-44 bg-gray-100 overflow-hidden">
        {thumbnail ? (
          <img src={thumbnail} alt={res.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center gap-2 ${isPlaylist ? 'bg-gradient-to-br from-orange-400 to-orange-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'}`}>
            {isPlaylist ? (
              <>
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-8 bg-white rounded-full opacity-80" style={{ height: `${20 + i * 8}px` }} />
                  ))}
                  {[0,1].map(i => (
                    <div key={i} className="w-1.5 h-8 bg-white rounded-full opacity-60" style={{ height: `${32 - i * 8}px` }} />
                  ))}
                </div>
                <p className="text-white text-xs font-bold opacity-90">PLAYLIST</p>
              </>
            ) : (
              <Play size={32} className="text-white opacity-80" />
            )}
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-0 group-hover:bg-opacity-90 rounded-full flex items-center justify-center transition">
            <Play size={20} className="text-indigo-600 opacity-0 group-hover:opacity-100 transition ml-1" />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className={`${getResourceColor(res.type)} text-white text-xs font-bold px-2 py-0.5 rounded-md`}>
            {getResourceLabel(res.type)}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm group-hover:text-indigo-600 transition line-clamp-2 leading-snug">{res.title}</h3>
        <p className="text-xs text-gray-400 mt-1.5 truncate">{res.url}</p>
      </div>
    </a>
  );
};

  const OtherCard = ({ res }) => (
    <a href={res.url} target="_blank" rel="noreferrer" className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-4 hover:border-indigo-200 hover:shadow-md transition group">
      <div className={`${getResourceColor(res.type)} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
        <span className="text-white text-xs font-bold text-center leading-tight px-1">{getResourceLabel(res.type)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-800 text-sm group-hover:text-indigo-600 transition line-clamp-1">{res.title}</h3>
        <p className="text-xs text-gray-400 mt-0.5 truncate">{res.url}</p>
      </div>
      <ExternalLink size={16} className="text-gray-300 group-hover:text-indigo-500 transition flex-shrink-0" />
    </a>
  );

  const displayVideos = activeFilter === 'ALL' ? videos : filteredResources.filter(r => r.type === 'VIDEO' || r.type === 'PLAYLIST');
  const displayOthers = activeFilter === 'ALL' ? others : filteredResources.filter(r => r.type !== 'VIDEO' && r.type !== 'PLAYLIST');

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

        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate('/skills')} className="p-2 hover:bg-gray-200 rounded-lg transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <BookOpen size={22} className="text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{skill.name}</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  {skill.category && (
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">{skill.category}</span>
                  )}
                  <span className="text-gray-400 text-sm">{resources.length} resources available</span>
                </div>
              </div>
            </div>
            {skill.description && (
              <p className="text-gray-500 text-sm mt-3 leading-relaxed">{skill.description}</p>
            )}
          </div>
        </div>

        {resources.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
            <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-600 mb-2">No resources yet</h3>
            <p className="text-gray-400 text-sm">Resources for this skill haven't been added yet.</p>
          </div>
        ) : (
          <div>
            <div className="flex gap-2 flex-wrap mb-6">
              {FILTERS.filter(f => f === 'ALL' || resources.some(r => r.type === f)).map(filter => (
                <button key={filter} onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${activeFilter === filter ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'}`}>
                  {filter === 'ALL' ? `All (${resources.length})` : filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            {displayVideos.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Play size={18} className="text-red-500" />
                  Videos & Playlists
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayVideos.map(res => <VideoCard key={res.id} res={res} />)}
                </div>
              </div>
            )}

            {displayOthers.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-indigo-500" />
                  {activeFilter === 'ALL' ? 'Other Resources' : activeFilter.replace('_', ' ')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {displayOthers.map(res => <OtherCard key={res.id} res={res} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillDetailPage;