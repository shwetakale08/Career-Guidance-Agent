import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import {
  getAdminStats,
  adminGetCareers, adminCreateCareer, adminUpdateCareer, adminDeleteCareer,
  adminAddSkillToCareer, adminRemoveSkillFromCareer,
  adminGetSkills, adminCreateSkill, adminUpdateSkill, adminDeleteSkill,
  adminGetResources, adminCreateResource, adminDeleteResource,
  adminGetAiTools, adminCreateAiTool, adminUpdateAiTool, adminDeleteAiTool,
} from '../api/adminApi';
import { getAllSkills } from '../api/skillApi';
import { LayoutDashboard, Briefcase, BookOpen, FileText, Cpu, LogOut, Plus, Pencil, Trash2, X, Check, Users, Link2 } from 'lucide-react';

const TABS = ['Dashboard', 'Careers', 'Skills', 'Resources', 'AI Tools'];

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-screen overflow-y-auto">
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
        <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
          <X size={18} className="text-gray-500" />
        </button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" {...props} />
  </div>
);

const Select = ({ label, children, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" {...props}>
      {children}
    </select>
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div>
    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
    <textarea className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" rows={3} {...props} />
  </div>
);

const AdminPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState(null);
  const [careers, setCareers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [resources, setResources] = useState([]);
  const [aiTools, setAiTools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [linkCareer, setLinkCareer] = useState(null);

  const [careerForm, setCareerForm] = useState({ title: '', description: '', avgSalary: '', demandLevel: 'HIGH', interestTags: '', workStyleTags: '', goalTags: '' });
  const [skillForm, setSkillForm] = useState({ name: '', category: '', description: '' });
  const [resourceForm, setResourceForm] = useState({ title: '', type: 'VIDEO', url: '', skillId: '', careerId: '' });
  const [aiToolForm, setAiToolForm] = useState({ name: '', description: '', useCase: '', websiteUrl: '', logoUrl: '', pricingType: 'FREE', category: '' });

  useEffect(() => {
    // Always try to load stats - the backend will return 403 if not admin.
    // This avoids the stale-localStorage bug where DB role is ADMIN but
    // localStorage still says USER (happens when role is set in DB without re-login).
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'Careers') { fetchCareers(); fetchAllSkills(); }
    if (activeTab === 'Skills') fetchSkills();
    if (activeTab === 'Resources') { fetchResources(); fetchAllSkills(); fetchCareers(); }
    if (activeTab === 'AI Tools') fetchAiTools();
  }, [activeTab]);

  const fetchStats = async () => { try { const r = await getAdminStats(); setStats(r.data); } catch (err) { if (err.response?.status === 403) { toast.error('Access denied. Admin role required.'); navigate('/dashboard'); } else { toast.error('Failed to load stats') } } };
  const fetchCareers = async () => { try { const r = await adminGetCareers(); setCareers(r.data); } catch { } };
  const fetchSkills = async () => { try { const r = await adminGetSkills(); setSkills(r.data); } catch { } };
  const fetchAllSkills = async () => { try { const r = await getAllSkills(); setAllSkills(r.data); } catch { } };
  const fetchResources = async () => { try { const r = await adminGetResources(); setResources(r.data); } catch { } };
  const fetchAiTools = async () => { try { const r = await adminGetAiTools(); setAiTools(r.data); } catch { } };

  const handleLogout = () => { logout(); navigate('/login'); };

  const openModal = (type, item = null) => {
    setModal(type);
    setEditItem(item);
    if (type === 'career') setCareerForm(item ? { title: item.title, description: item.description || '', avgSalary: item.avgSalary || '', demandLevel: item.demandLevel || 'HIGH', interestTags: item.interestTags || '', workStyleTags: item.workStyleTags || '', goalTags: item.goalTags || '' } : { title: '', description: '', avgSalary: '', demandLevel: 'HIGH', interestTags: '', workStyleTags: '', goalTags: '' });
    if (type === 'skill') setSkillForm(item ? { name: item.name, category: item.category || '', description: item.description || '' } : { name: '', category: '', description: '' });
    if (type === 'resource') setResourceForm({ title: '', type: 'VIDEO', url: '', skillId: '', careerId: '' });
    if (type === 'aitool') setAiToolForm(item ? { name: item.name, description: item.description || '', useCase: item.useCase || '', websiteUrl: item.websiteUrl || '', logoUrl: item.logoUrl || '', pricingType: item.pricingType || 'FREE', category: item.category || '' } : { name: '', description: '', useCase: '', websiteUrl: '', logoUrl: '', pricingType: 'FREE', category: '' });
  };

  const closeModal = () => { setModal(null); setEditItem(null); setLinkCareer(null); };

  const handleCareerSubmit = async () => {
    setLoading(true);
    try {
      if (editItem) { await adminUpdateCareer(editItem.id, careerForm); toast.success('Career updated'); }
      else { await adminCreateCareer(careerForm); toast.success('Career created'); }
      fetchCareers(); closeModal();
    } catch { toast.error('Failed to save career'); }
    finally { setLoading(false); }
  };

  const handleSkillSubmit = async () => {
    setLoading(true);
    try {
      if (editItem) { await adminUpdateSkill(editItem.id, skillForm); toast.success('Skill updated'); }
      else { await adminCreateSkill(skillForm); toast.success('Skill created'); }
      fetchSkills(); closeModal();
    } catch { toast.error('Failed to save skill'); }
    finally { setLoading(false); }
  };

  const handleResourceSubmit = async () => {
    setLoading(true);
    try {
      const payload = { ...resourceForm, skillId: resourceForm.skillId || null, careerId: resourceForm.careerId || null };
      await adminCreateResource(payload);
      toast.success('Resource created');
      fetchResources(); closeModal();
    } catch { toast.error('Failed to save resource'); }
    finally { setLoading(false); }
  };

  const handleAiToolSubmit = async () => {
    setLoading(true);
    try {
      if (editItem) { await adminUpdateAiTool(editItem.id, aiToolForm); toast.success('AI Tool updated'); }
      else { await adminCreateAiTool(aiToolForm); toast.success('AI Tool created'); }
      fetchAiTools(); closeModal();
    } catch { toast.error('Failed to save AI Tool'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      if (type === 'career') { await adminDeleteCareer(id); fetchCareers(); }
      if (type === 'skill') { await adminDeleteSkill(id); fetchSkills(); }
      if (type === 'resource') { await adminDeleteResource(id); fetchResources(); }
      if (type === 'aitool') { await adminDeleteAiTool(id); fetchAiTools(); }
      toast.success('Deleted successfully');
    } catch { toast.error('Failed to delete'); }
  };

  const handleLinkSkill = async (skillId) => {
    try {
      await adminAddSkillToCareer(linkCareer.id, skillId);
      toast.success('Skill linked');
      fetchCareers();
    } catch { toast.error('Failed to link skill'); }
  };

  const handleUnlinkSkill = async (skillId) => {
    try {
      await adminRemoveSkillFromCareer(linkCareer.id, skillId);
      toast.success('Skill removed');
      fetchCareers();
      const updated = careers.find(c => c.id === linkCareer.id);
      if (updated) setLinkCareer(updated);
    } catch { toast.error('Failed to remove skill'); }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Careers', value: stats.totalCareers, icon: Briefcase, color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Skills', value: stats.totalSkills, icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
    { label: 'Resources', value: stats.totalResources, icon: FileText, color: 'bg-green-50 text-green-600' },
    { label: 'AI Tools', value: stats.totalAiTools, icon: Cpu, color: 'bg-orange-50 text-orange-600' },
    { label: 'Resumes Analyzed', value: stats.totalResumes, icon: FileText, color: 'bg-red-50 text-red-600' },
  ] : [];

  const tabIcons = { Dashboard: LayoutDashboard, Careers: Briefcase, Skills: BookOpen, Resources: FileText, 'AI Tools': Cpu };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col sticky top-0 h-screen">
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-indigo-600">AI Career Guidance Agent</h1>
          <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map((tab) => {
            const Icon = tabIcons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <Icon size={16} />{tab}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-indigo-600 transition">
            Back to app
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-600 transition w-full">
            <LogOut size={15} />Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">

        {/* Dashboard tab */}
        {activeTab === 'Dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              {statCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${card.color.split(' ')[0]}`}>
                        <Icon size={20} className={card.color.split(' ')[1]} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">{card.label}</p>
                        <p className="text-2xl font-black text-gray-800">{card.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Careers tab */}
        {activeTab === 'Careers' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Careers</h2>
              <button onClick={() => openModal('career')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                <Plus size={16} />Add Career
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Demand</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Salary</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Skills</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {careers.map((career) => (
                    <tr key={career.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{career.title}</td>
                      <td className="px-4 py-3">
                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{career.demandLevel}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{career.avgSalary || '-'}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => { setLinkCareer(career); setModal('linkSkill'); fetchAllSkills(); }} className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-medium">
                          <Link2 size={12} />{career.skills?.length || 0} skills
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal('career', career)} className="p-1.5 hover:bg-indigo-50 rounded-lg transition">
                            <Pencil size={14} className="text-indigo-500" />
                          </button>
                          <button onClick={() => handleDelete('career', career.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Skills tab */}
        {activeTab === 'Skills' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Skills</h2>
              <button onClick={() => openModal('skill')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                <Plus size={16} />Add Skill
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {skills.map((skill) => (
                    <tr key={skill.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{skill.name}</td>
                      <td className="px-4 py-3"><span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full">{skill.category || '-'}</span></td>
                      <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{skill.description || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal('skill', skill)} className="p-1.5 hover:bg-indigo-50 rounded-lg transition">
                            <Pencil size={14} className="text-indigo-500" />
                          </button>
                          <button onClick={() => handleDelete('skill', skill.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Resources tab */}
        {activeTab === 'Resources' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Resources</h2>
              <button onClick={() => openModal('resource')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                <Plus size={16} />Add Resource
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">URL</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {resources.map((res) => (
                    <tr key={res.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{res.title}</td>
                      <td className="px-4 py-3"><span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{res.type}</span></td>
                      <td className="px-4 py-3 text-indigo-500 max-w-xs truncate">
                        <a href={res.url} target="_blank" rel="noreferrer" className="hover:underline">{res.url}</a>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete('resource', res.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                          <Trash2 size={14} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI Tools tab */}
        {activeTab === 'AI Tools' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">AI Tools</h2>
              <button onClick={() => openModal('aitool')} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                <Plus size={16} />Add AI Tool
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Pricing</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Website</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {aiTools.map((tool) => (
                    <tr key={tool.id} className="hover:bg-gray-50 transition">
                      <td className="px-4 py-3 font-medium text-gray-800">{tool.name}</td>
                      <td className="px-4 py-3"><span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">{tool.category || '-'}</span></td>
                      <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{tool.pricingType}</span></td>
                      <td className="px-4 py-3 text-indigo-500 max-w-xs truncate">
                        {tool.websiteUrl ? <a href={tool.websiteUrl} target="_blank" rel="noreferrer" className="hover:underline">{tool.websiteUrl}</a> : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openModal('aitool', tool)} className="p-1.5 hover:bg-indigo-50 rounded-lg transition">
                            <Pencil size={14} className="text-indigo-500" />
                          </button>
                          <button onClick={() => handleDelete('aitool', tool.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition">
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Career Modal */}
      {modal === 'career' && (
        <Modal title={editItem ? 'Edit Career' : 'Add Career'} onClose={closeModal}>
          <div className="space-y-3">
            <Input label="Title *" value={careerForm.title} onChange={(e) => setCareerForm({ ...careerForm, title: e.target.value })} placeholder="e.g. Data Scientist" />
            <Textarea label="Description" value={careerForm.description} onChange={(e) => setCareerForm({ ...careerForm, description: e.target.value })} placeholder="Brief description..." />
            <Input label="Average Salary" value={careerForm.avgSalary} onChange={(e) => setCareerForm({ ...careerForm, avgSalary: e.target.value })} placeholder="e.g. 8-25 LPA" />
            <Select label="Demand Level" value={careerForm.demandLevel} onChange={(e) => setCareerForm({ ...careerForm, demandLevel: e.target.value })}>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="VERY_HIGH">Very High</option>
            </Select>
            <Input label="Interest Tags (comma separated)" value={careerForm.interestTags} onChange={(e) => setCareerForm({ ...careerForm, interestTags: e.target.value })} placeholder="technology,analysis,math" />
            <Input label="Work Style Tags (comma separated)" value={careerForm.workStyleTags} onChange={(e) => setCareerForm({ ...careerForm, workStyleTags: e.target.value })} placeholder="analytical,problem-solving" />
            <Input label="Goal Tags (comma separated)" value={careerForm.goalTags} onChange={(e) => setCareerForm({ ...careerForm, goalTags: e.target.value })} placeholder="job,freelance" />
            <button onClick={handleCareerSubmit} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
              <Check size={16} />{editItem ? 'Update Career' : 'Create Career'}
            </button>
          </div>
        </Modal>
      )}

      {/* Skill Modal */}
      {modal === 'skill' && (
        <Modal title={editItem ? 'Edit Skill' : 'Add Skill'} onClose={closeModal}>
          <div className="space-y-3">
            <Input label="Skill Name *" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="e.g. Python" />
            <Input label="Category" value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })} placeholder="e.g. Programming" />
            <Textarea label="Description" value={skillForm.description} onChange={(e) => setSkillForm({ ...skillForm, description: e.target.value })} placeholder="Brief description..." />
            <button onClick={handleSkillSubmit} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
              <Check size={16} />{editItem ? 'Update Skill' : 'Create Skill'}
            </button>
          </div>
        </Modal>
      )}

      {/* Resource Modal */}
      {modal === 'resource' && (
        <Modal title="Add Resource" onClose={closeModal}>
          <div className="space-y-3">
            <Input label="Title *" value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} placeholder="e.g. Python Full Course" />
            <Select label="Type *" value={resourceForm.type} onChange={(e) => setResourceForm({ ...resourceForm, type: e.target.value })}>
              <option value="VIDEO">Video</option>
              <option value="PLAYLIST">Playlist</option>
              <option value="GITHUB_REPO">GitHub Repo</option>
              <option value="ARTICLE">Article</option>
              <option value="COURSE">Course</option>
            </Select>
            <Input label="URL *" value={resourceForm.url} onChange={(e) => setResourceForm({ ...resourceForm, url: e.target.value })} placeholder="https://..." />
            <Select label="Link to Skill" value={resourceForm.skillId} onChange={(e) => setResourceForm({ ...resourceForm, skillId: e.target.value })}>
              <option value="">- Select Skill -</option>
              {allSkills.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <Select label="Link to Career" value={resourceForm.careerId} onChange={(e) => setResourceForm({ ...resourceForm, careerId: e.target.value })}>
              <option value="">- Select Career -</option>
              {careers.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </Select>
            <button onClick={handleResourceSubmit} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
              <Check size={16} />Create Resource
            </button>
          </div>
        </Modal>
      )}

      {/* AI Tool Modal */}
      {modal === 'aitool' && (
        <Modal title={editItem ? 'Edit AI Tool' : 'Add AI Tool'} onClose={closeModal}>
          <div className="space-y-3">
            <Input label="Name *" value={aiToolForm.name} onChange={(e) => setAiToolForm({ ...aiToolForm, name: e.target.value })} placeholder="e.g. ChatGPT" />
            <Textarea label="Description" value={aiToolForm.description} onChange={(e) => setAiToolForm({ ...aiToolForm, description: e.target.value })} placeholder="What does this tool do?" />
            <Textarea label="When to use" value={aiToolForm.useCase} onChange={(e) => setAiToolForm({ ...aiToolForm, useCase: e.target.value })} placeholder="Use cases and when to apply it..." />
            <Input label="Website URL" value={aiToolForm.websiteUrl} onChange={(e) => setAiToolForm({ ...aiToolForm, websiteUrl: e.target.value })} placeholder="https://..." />
            <Input label="Category" value={aiToolForm.category} onChange={(e) => setAiToolForm({ ...aiToolForm, category: e.target.value })} placeholder="e.g. Writing, Coding, Design" />
            <Select label="Pricing Type" value={aiToolForm.pricingType} onChange={(e) => setAiToolForm({ ...aiToolForm, pricingType: e.target.value })}>
              <option value="FREE">Free</option>
              <option value="FREEMIUM">Freemium</option>
              <option value="PAID">Paid</option>
            </Select>
            <button onClick={handleAiToolSubmit} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2">
              <Check size={16} />{editItem ? 'Update AI Tool' : 'Create AI Tool'}
            </button>
          </div>
        </Modal>
      )}

      {/* Link Skills to Career Modal */}
      {modal === 'linkSkill' && linkCareer && (
        <Modal title={`Link Skills - ${linkCareer.title}`} onClose={closeModal}>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Linked Skills</p>
              {linkCareer.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {linkCareer.skills.map((skill) => (
                    <span key={skill.id} className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full border border-indigo-200">
                      {skill.name}
                      <button onClick={() => handleUnlinkSkill(skill.id)} className="hover:text-red-500 transition">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No skills linked yet.</p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Add Skills</p>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {allSkills.filter(s => !linkCareer.skills?.find(ls => ls.id === s.id)).map((skill) => (
                  <button key={skill.id} onClick={() => handleLinkSkill(skill.id)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-indigo-50 rounded-lg transition text-sm text-gray-700 group">
                    <span>{skill.name}</span>
                    <Plus size={14} className="text-gray-300 group-hover:text-indigo-500 transition" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};

export default AdminPage;