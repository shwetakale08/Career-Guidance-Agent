import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getCareerById, getSkillGap } from '../api/careerApi';
import { getResourcesBySkill } from '../api/resourceApi';
import { getYoutubeThumbnail, getResourceColor, getResourceLabel } from '../utils/helpers';
import { ArrowLeft, TrendingUp, Briefcase, BookOpen, Cpu, FileText, LogOut, CheckCircle, XCircle, ExternalLink, DollarSign, BarChart2 } from 'lucide-react';
import { markSkill, unmarkSkill, getCareerReadiness } from '../api/progressApi';

const CareerDetailPage = () => {
  const { careerId } = useParams();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [career, setCareer] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [skillResources, setSkillResources] = useState({});
  const [expandedSkill, setExpandedSkill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState(null);
  const [progressMap, setProgressMap] = useState({});
  const [progressLoading, setProgressLoading] = useState({});

  useEffect(() => { fetchData(); }, [careerId]);

  const fetchData = async () => {
    try {
      const [careerRes, gapRes] = await Promise.all([
        getCareerById(careerId),
        getSkillGap(careerId),
      ]);
      setCareer(careerRes.data);
      setSkillGap(gapRes.data);

      try {
        const readinessRes = await getCareerReadiness(careerId);
        setReadiness(readinessRes.data);
        const map = {};
        readinessRes.data.skillProgresses?.forEach(p => {
          map[p.skillId] = p.status;
        });
        setProgressMap(map);
      } catch {
        setReadiness(null);
      }
    } catch {
      toast.error('Failed to load career');
    } finally {
      setLoading(false);
    }
  };

  const handleExpandSkill = async (skill) => {
    if (expandedSkill?.id === skill.id) { setExpandedSkill(null); return; }
    setExpandedSkill(skill);
    if (skillResources[skill.id]) return;
    try {
      const res = await getResourcesBySkill(skill.id);
      setSkillResources(prev => ({ ...prev, [skill.id]: res.data }));
    } catch {
      setSkillResources(prev => ({ ...prev, [skill.id]: [] }));
    }
  };

  const handleMarkSkill = async (skillId, status) => {
    setProgressLoading(prev => ({ ...prev, [skillId]: true }));
    try {
      await markSkill(skillId, Number(careerId), status);
      setProgressMap(prev => ({ ...prev, [skillId]: status }));
      const res = await getCareerReadiness(careerId);
      setReadiness(res.data);
      toast.success(status === 'COMPLETED' ? 'Skill marked as completed!' : 'Skill marked as learning!');
    } catch {
      toast.error('Failed to update progress');
    } finally {
      setProgressLoading(prev => ({ ...prev, [skillId]: false }));
    }
  };

  const handleUnmarkSkill = async (skillId) => {
    setProgressLoading(prev => ({ ...prev, [skillId]: true }));
    try {
      await unmarkSkill(skillId, Number(careerId));
      setProgressMap(prev => {
        const updated = { ...prev };
        delete updated[skillId];
        return updated;
      });
      const res = await getCareerReadiness(careerId);
      setReadiness(res.data);
      toast.success('Skill unmarked');
    } catch {
      toast.error('Failed to update progress');
    } finally {
      setProgressLoading(prev => ({ ...prev, [skillId]: false }));
    }
  };

  const getDemandColor = (level) => {
    if (level === 'VERY_HIGH') return 'bg-green-100 text-green-700 border-green-200';
    if (level === 'HIGH') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (level === 'MEDIUM') return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { label: 'Careers', icon: Briefcase, path: '/careers' },
    { label: 'Skills', icon: BookOpen, path: '/skills' },
    { label: 'AI Tools', icon: Cpu, path: '/ai-tools' },
    { label: 'Resume', icon: FileText, path: '/resume' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!career) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Career not found</p>
        <button onClick={() => navigate('/careers')} className="text-indigo-600 font-medium hover:underline">Back to Careers</button>
      </div>
    </div>
  );

  const knownSkills = skillGap?.knownSkills || [];
  const missingSkills = skillGap?.missingSkills || [];
  const totalSkills = knownSkills.length + missingSkills.length;

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

      <div className="max-w-5xl mx-auto px-6 py-8">

        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 text-sm font-medium mb-6 transition">
          <ArrowLeft size={16} />Back
        </button>

        {/* Hero */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white mb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Briefcase size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white">{career.title}</h1>
                  {career.demandLevel && (
                    <span className="inline-block bg-white bg-opacity-25 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                      {career.demandLevel.replace('_', ' ')} Demand
                    </span>
                  )}
                </div>
              </div>
              <p className="text-indigo-100 text-sm leading-relaxed">{career.description}</p>
            </div>
            <div className="flex-shrink-0 text-center bg-white bg-opacity-20 rounded-xl px-6 py-4 min-w-32">
              <p className="text-indigo-200 text-xs mb-1">Avg Salary</p>
              <p className="text-xl font-black text-white">{career.avgSalary || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Readiness */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <BarChart2 size={18} className="text-indigo-500" />
              Your Readiness
            </h2>
            <span className={`text-2xl font-black ${(readiness?.readinessPercent || 0) >= 60 ? 'text-green-600' : (readiness?.readinessPercent || 0) >= 30 ? 'text-yellow-500' : 'text-red-500'}`}>
              {readiness?.readinessPercent || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
            <div
              className={`h-3 rounded-full transition-all duration-700 ${(readiness?.readinessPercent || 0) >= 60 ? 'bg-green-500' : (readiness?.readinessPercent || 0) >= 30 ? 'bg-yellow-500' : 'bg-red-400'}`}
              style={{ width: `${readiness?.readinessPercent || 0}%` }}
            />
          </div>
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="flex items-center gap-1.5 text-green-600 font-medium">
              <CheckCircle size={14} />{readiness?.completedSkills || 0} completed
            </span>
            <span className="flex items-center gap-1.5 text-blue-500 font-medium">
              <BookOpen size={14} />{readiness?.learningSkills || 0} learning
            </span>
            <span className="flex items-center gap-1.5 text-red-400 font-medium">
              <XCircle size={14} />
              {(readiness?.totalSkills || 0) - (readiness?.completedSkills || 0) - (readiness?.learningSkills || 0)} not started
            </span>
            <span className="text-gray-400">{readiness?.totalSkills || totalSkills} total required</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">

          <div className="col-span-2 space-y-5">

            {/* Known skills */}
            {knownSkills.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-500" />
                  Skills you already have
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-auto">{knownSkills.length}</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {knownSkills.map(skill => (
                    <button key={skill.id} onClick={() => navigate(`/skills/${skill.id}`)}
                      className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-green-100 transition">
                      <CheckCircle size={10} />{skill.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Missing skills with learning order */}
            {missingSkills.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                  <XCircle size={18} className="text-red-400" />
                  Skills to learn
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full ml-auto">{missingSkills.length}</span>
                </h2>
                <p className="text-xs text-gray-400 mb-4">Sorted by recommended learning order</p>

                <div className="space-y-3">
                  {missingSkills.map((skill, index) => {
                    const status = progressMap[skill.id];
                    const isCompleted = status === 'COMPLETED';
                    const isLearning = status === 'LEARNING';
                    const isSkillLoading = progressLoading[skill.id];

                    const stepLabel = index === 0 ? 'Start here' :
                                      index === 1 ? 'Then this' :
                                      index === 2 ? 'Next up' :
                                      `Step ${index + 1}`;

                    const stepColor = index === 0 ? 'bg-indigo-600 text-white' :
                                      index === 1 ? 'bg-indigo-400 text-white' :
                                      index === 2 ? 'bg-indigo-300 text-white' :
                                      'bg-gray-100 text-gray-500';

                    return (
                      <div key={skill.id} className="border border-gray-100 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                          <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => handleExpandSkill(skill)}>

                            {/* Step number badge */}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black ${isCompleted ? 'bg-green-500 text-white' : isLearning ? 'bg-blue-500 text-white' : stepColor}`}>
                              {isCompleted ? '✓' : isLearning ? '~' : index + 1}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className={`font-semibold text-sm ${isCompleted ? 'text-green-700 line-through' : 'text-gray-800'}`}>
                                  {skill.name}
                                </p>
                                {index < 3 && !isCompleted && !isLearning && (
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stepColor}`}>
                                    {stepLabel}
                                  </span>
                                )}
                                {isCompleted && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">Done</span>}
                                {isLearning && <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">Learning</span>}
                              </div>
                              {skill.category && <p className="text-xs text-gray-400 mt-0.5">{skill.category}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!isLearning && !isCompleted && (
                              <button disabled={isSkillLoading} onClick={() => handleMarkSkill(skill.id, 'LEARNING')}
                                className="text-xs text-blue-600 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition disabled:opacity-50">
                                Learning
                              </button>
                            )}
                            {!isCompleted && (
                              <button disabled={isSkillLoading} onClick={() => handleMarkSkill(skill.id, 'COMPLETED')}
                                className="text-xs text-green-600 border border-green-200 px-2.5 py-1 rounded-lg hover:bg-green-50 transition disabled:opacity-50">
                                Done
                              </button>
                            )}
                            {(isLearning || isCompleted) && (
                              <button disabled={isSkillLoading} onClick={() => handleUnmarkSkill(skill.id)}
                                className="text-xs text-gray-400 border border-gray-200 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition disabled:opacity-50">
                                Undo
                              </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); navigate(`/skills/${skill.id}`); }}
                              className="text-xs text-indigo-600 border border-indigo-200 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition">
                              Resources
                            </button>
                            <span className="text-gray-400 text-xs cursor-pointer" onClick={() => handleExpandSkill(skill)}>
                              {expandedSkill?.id === skill.id ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>

                        {expandedSkill?.id === skill.id && (
                          <div className="border-t border-gray-100 p-4 bg-gray-50">
                            {skillResources[skill.id] === undefined ? (
                              <div className="flex justify-center py-3">
                                <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                              </div>
                            ) : skillResources[skill.id].length === 0 ? (
                              <p className="text-xs text-gray-400 text-center py-2">No resources added yet.</p>
                            ) : (
                              <div className="space-y-2">
                                {skillResources[skill.id].slice(0, 3).map(res => {
                                  const thumbnail = getYoutubeThumbnail(res.url);
                                  return (
                                    <a key={res.id} href={res.url} target="_blank" rel="noreferrer"
                                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-white transition group">
                                      {thumbnail ? (
                                        <img src={thumbnail} alt={res.title} className="w-16 h-10 object-cover rounded-lg flex-shrink-0" />
                                      ) : (
                                        <div className={`${getResourceColor(res.type)} w-16 h-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                                          <span className="text-white text-xs font-bold">{getResourceLabel(res.type)}</span>
                                        </div>
                                      )}
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-700 group-hover:text-indigo-600 transition line-clamp-1">{res.title}</p>
                                        <p className="text-xs text-gray-400 truncate">{res.url}</p>
                                      </div>
                                      <ExternalLink size={12} className="text-gray-300 group-hover:text-indigo-500 flex-shrink-0" />
                                    </a>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Career Overview</h3>
              <div className="space-y-3">
                {career.avgSalary && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                      <DollarSign size={14} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Avg Salary</p>
                      <p className="text-sm font-bold text-gray-800">{career.avgSalary}</p>
                    </div>
                  </div>
                )}
                {career.demandLevel && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <TrendingUp size={14} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Market Demand</p>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getDemandColor(career.demandLevel)}`}>
                        {career.demandLevel.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                    <BookOpen size={14} className="text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Skills Required</p>
                    <p className="text-sm font-bold text-gray-800">{totalSkills} skills</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Quick Actions</h3>
              <button onClick={() => navigate('/resume')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2.5 rounded-xl transition">
                Analyze my resume
              </button>
              <button onClick={() => navigate('/skills')}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl transition">
                Browse all skills
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetailPage;