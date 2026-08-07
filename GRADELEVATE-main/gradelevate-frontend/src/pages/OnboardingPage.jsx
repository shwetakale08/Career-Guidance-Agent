import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { saveProfile } from '../api/profileApi';
import { getSmartRecommendations } from '../api/profileApi';
import { getAllCareers } from '../api/careerApi';
import { getAllSkills } from '../api/skillApi';
import { Briefcase, Lightbulb, ChevronRight, CheckCircle, ArrowLeft, TrendingUp, Star } from 'lucide-react';

const LANGUAGES = ['Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart', 'R', 'None yet'];
const WORK_PREFS = [
  { label: 'Frontend Development', value: 'frontend', desc: 'Building user interfaces and web pages' },
  { label: 'Backend Development', value: 'backend', desc: 'APIs, databases and server logic' },
  { label: 'Full Stack', value: 'fullstack', desc: 'Both frontend and backend' },
  { label: 'Data & Analytics', value: 'data', desc: 'Working with data and insights' },
  { label: 'AI & Machine Learning', value: 'ai', desc: 'Building intelligent systems' },
  { label: 'Mobile Development', value: 'mobile', desc: 'iOS and Android apps' },
  { label: 'Cybersecurity', value: 'security', desc: 'Protecting systems and networks' },
  { label: 'UI/UX Design', value: 'design', desc: 'Designing user experiences' },
];
const GOALS = [
  { label: 'Get a job', value: 'job' },
  { label: 'Freelancing', value: 'freelance' },
  { label: 'Start a business', value: 'startup' },
  { label: 'Higher studies', value: 'higher_studies' },
];
const EDUCATION_LEVELS = [
  { label: '10th Grade', value: 'TENTH' },
  { label: '12th Grade', value: 'TWELFTH' },
  { label: 'Undergraduate', value: 'UNDERGRADUATE' },
  { label: 'Graduate', value: 'GRADUATE' },
];
const EXPERIENCE_LEVELS = [
  { label: 'Complete beginner', value: 'BEGINNER', desc: 'Just starting out' },
  { label: 'Know the basics', value: 'BASIC', desc: 'Familiar with fundamentals' },
  { label: 'Intermediate', value: 'INTERMEDIATE', desc: 'Built some projects' },
  { label: 'Advanced', value: 'ADVANCED', desc: 'Strong hands-on experience' },
];
const DAILY_HOURS = [
  { label: '1-2 hours', value: '1-2' },
  { label: '3-4 hours', value: '3-4' },
  { label: '5+ hours', value: '5+' },
];

const OnboardingPage = () => {
  const navigate = useNavigate();

  const [path, setPath] = useState(null);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [careers, setCareers] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const [form, setForm] = useState({
    educationLevel: '',
    knownLanguages: [],
    knownSkillNames: [],
    workPreference: '',
    workStyle: [],
    goal: '',
    dailyHours: '',
    interestAreas: [],
    careerInMind: '',
    careerInMindId: null,
    experienceLevel: '',
  });

  useEffect(() => {
    getAllCareers().then(r => setCareers(r.data)).catch(() => {});
    getAllSkills().then(r => setAllSkills(r.data)).catch(() => {});
  }, []);

  const toggleMulti = (field, value) => {
    const current = form[field];
    if (current.includes(value)) {
      setForm({ ...form, [field]: current.filter(v => v !== value) });
    } else {
      setForm({ ...form, [field]: [...current, value] });
    }
  };

  const isSelected = (field, value) => {
    const val = form[field];
    return Array.isArray(val) ? val.includes(value) : val === value;
  };

  // ─── CONFUSED PATH STEPS ───────────────────────────────
  const confusedSteps = [
    {
      title: 'What is your education level?',
      content: (
        <div className="grid grid-cols-2 gap-3">
          {EDUCATION_LEVELS.map(opt => (
            <button key={opt.value} onClick={() => setForm({ ...form, educationLevel: opt.value })}
              className={`p-4 rounded-xl border-2 text-left transition ${form.educationLevel === opt.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <p className={`font-semibold text-sm ${form.educationLevel === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.label}</p>
            </button>
          ))}
        </div>
      ),
      canProceed: () => form.educationLevel !== '',
    },
    {
      title: 'Which programming languages do you know?',
      subtitle: 'Select all that apply',
      content: (
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map(lang => (
            <button key={lang} onClick={() => toggleMulti('knownLanguages', lang)}
              className={`p-3 rounded-xl border-2 text-sm font-medium transition ${isSelected('knownLanguages', lang) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
              {lang}
            </button>
          ))}
        </div>
      ),
      canProceed: () => form.knownLanguages.length > 0,
    },
    {
      title: 'Which technologies do you already know?',
      subtitle: 'Select all that apply',
      content: (
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {allSkills.map(skill => (
            <button key={skill.id} onClick={() => toggleMulti('knownSkillNames', skill.name)}
              className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition ${isSelected('knownSkillNames', skill.name) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
              <p className="font-medium">{skill.name}</p>
              {skill.category && <p className="text-xs opacity-60 mt-0.5">{skill.category}</p>}
            </button>
          ))}
        </div>
      ),
      canProceed: () => true,
    },
    {
      title: 'What kind of work excites you most?',
      content: (
        <div className="grid grid-cols-2 gap-3">
          {WORK_PREFS.map(opt => (
            <button key={opt.value} onClick={() => setForm({ ...form, workPreference: opt.value })}
              className={`p-4 rounded-xl border-2 text-left transition ${form.workPreference === opt.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <p className={`font-semibold text-sm ${form.workPreference === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      canProceed: () => form.workPreference !== '',
    },
    {
      title: 'What is your primary goal?',
      content: (
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map(opt => (
            <button key={opt.value} onClick={() => setForm({ ...form, goal: opt.value })}
              className={`p-4 rounded-xl border-2 text-center transition ${form.goal === opt.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <p className={`font-semibold text-sm ${form.goal === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.label}</p>
            </button>
          ))}
        </div>
      ),
      canProceed: () => form.goal !== '',
    },
    {
      title: 'How many hours can you dedicate daily?',
      content: (
        <div className="grid grid-cols-3 gap-3">
          {DAILY_HOURS.map(opt => (
            <button key={opt.value} onClick={() => setForm({ ...form, dailyHours: opt.value })}
              className={`p-4 rounded-xl border-2 text-center transition ${form.dailyHours === opt.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <p className={`font-semibold text-sm ${form.dailyHours === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.label}</p>
            </button>
          ))}
        </div>
      ),
      canProceed: () => form.dailyHours !== '',
    },
  ];

  // ─── HAS IDEA PATH STEPS ───────────────────────────────
  const hasIdeaSteps = [
    {
      title: 'Which career are you interested in?',
      subtitle: 'Search and select from our career list',
      content: (
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Search careers..."
            onChange={(e) => {}}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-2"
          />
          <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
            {careers.map(career => (
              <button key={career.id}
                onClick={() => setForm({ ...form, careerInMind: career.title, careerInMindId: career.id })}
                className={`w-full p-3 rounded-xl border-2 text-left transition ${form.careerInMindId === career.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
                <p className={`font-semibold text-sm ${form.careerInMindId === career.id ? 'text-indigo-700' : 'text-gray-700'}`}>{career.title}</p>
                {career.avgSalary && <p className="text-xs text-gray-400 mt-0.5">{career.avgSalary}</p>}
              </button>
            ))}
          </div>
        </div>
      ),
      canProceed: () => form.careerInMindId !== null,
    },
    {
      title: 'How would you rate your current skill level?',
      content: (
        <div className="grid grid-cols-2 gap-3">
          {EXPERIENCE_LEVELS.map(opt => (
            <button key={opt.value} onClick={() => setForm({ ...form, experienceLevel: opt.value })}
              className={`p-4 rounded-xl border-2 text-left transition ${form.experienceLevel === opt.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <p className={`font-semibold text-sm ${form.experienceLevel === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      ),
      canProceed: () => form.experienceLevel !== '',
    },
    {
      title: 'Which skills do you already have?',
      subtitle: 'Select all that apply',
      content: (
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {(form.careerInMindId
            ? allSkills.filter(s => {
                const career = careers.find(c => c.id === form.careerInMindId);
                return career?.skills?.some(cs => cs.id === s.id) ?? true;
              })
            : allSkills
          ).map(skill => (
            <button key={skill.id} onClick={() => toggleMulti('knownSkillNames', skill.name)}
              className={`p-3 rounded-xl border-2 text-sm font-medium text-left transition ${isSelected('knownSkillNames', skill.name) ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
              <p className="font-medium">{skill.name}</p>
              {skill.category && <p className="text-xs opacity-60 mt-0.5">{skill.category}</p>}
            </button>
          ))}
        </div>
      ),
      canProceed: () => true,
    },
    {
      title: 'What is your primary goal?',
      content: (
        <div className="grid grid-cols-2 gap-3">
          {GOALS.map(opt => (
            <button key={opt.value} onClick={() => setForm({ ...form, goal: opt.value })}
              className={`p-4 rounded-xl border-2 text-center transition ${form.goal === opt.value ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'}`}>
              <p className={`font-semibold text-sm ${form.goal === opt.value ? 'text-indigo-700' : 'text-gray-700'}`}>{opt.label}</p>
            </button>
          ))}
        </div>
      ),
      canProceed: () => form.goal !== '',
    },
  ];

  const steps = path === 'CONFUSED' ? confusedSteps : hasIdeaSteps;
  const currentStep = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = async () => {
    if (!currentStep.canProceed()) {
      toast.error('Please make a selection to continue');
      return;
    }
    if (!isLast) { setStep(step + 1); return; }
    await handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        onboardingType: path,
        educationLevel: form.educationLevel || null,
        knownLanguages: form.knownLanguages.join(','),
        knownSkillNames: form.knownSkillNames.join(','),
        workPreference: form.workPreference || null,
        workStyle: form.workStyle.join(','),
        goal: form.goal,
        dailyHours: form.dailyHours || null,
        interestAreas: form.interestAreas.join(','),
        careerInMind: form.careerInMind || null,
        careerInMindId: form.careerInMindId || null,
        experienceLevel: form.experienceLevel || null,
        onboardingCompleted: true,
      };

      await saveProfile(payload);

      if (path === 'CONFUSED') {
        toast.success('Analyzing your profile...');
        const res = await getSmartRecommendations();
        setRecommendations(res.data);
        setShowResults(true);
      } else {
        toast.success('Profile saved!');
        navigate(`/careers?careerId=${form.careerInMindId}`);
      }
    } catch (err) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDemandColor = (level) => {
    if (level === 'VERY_HIGH') return 'bg-green-100 text-green-700';
    if (level === 'HIGH') return 'bg-blue-100 text-blue-700';
    if (level === 'MEDIUM') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-600';
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600';
    if (score >= 50) return 'text-blue-600';
    return 'text-yellow-600';
  };

  // ─── RESULTS PAGE ──────────────────────────────────────
  if (showResults) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">Your Career Matches</h1>
          <p className="text-gray-500">Based on your skills and preferences, here are your top 3 recommended careers</p>
        </div>

        <div className="space-y-4 mb-8">
          {recommendations.map((rec, i) => (
            <div key={rec.careerId} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-lg ${i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}>
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{rec.careerTitle}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      {rec.demandLevel && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getDemandColor(rec.demandLevel)}`}>
                          {rec.demandLevel.replace('_', ' ')}
                        </span>
                      )}
                      {rec.avgSalary && (
                        <span className="text-xs text-gray-400">{rec.avgSalary}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-black ${getScoreColor(rec.matchScore)}`}>{rec.matchScore}%</p>
                  <p className="text-xs text-gray-400">match</p>
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-3">{rec.description}</p>

              {rec.skillMatchCount > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={14} className="text-green-500" />
                  <p className="text-xs text-green-700 font-medium">
                    You already know {rec.skillMatchCount} of {rec.totalSkillsRequired} required skills
                  </p>
                </div>
              )}

              {rec.aiExplanation && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
                  <p className="text-indigo-700 text-sm leading-relaxed">{rec.aiExplanation}</p>
                </div>
              )}

              <div className="w-full bg-gray-100 rounded-full h-2 mt-4">
                <div className={`h-2 rounded-full transition-all ${i === 0 ? 'bg-indigo-600' : i === 1 ? 'bg-purple-500' : 'bg-blue-500'}`}
                  style={{ width: `${rec.matchScore}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ChevronRight size={18} />
          </button>
          <button
            onClick={() => navigate('/careers')}
            className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl border border-gray-200 transition flex items-center justify-center gap-2"
          >
            Explore All Careers
          </button>
        </div>
      </div>
    </div>
  );

  // ─── PATH SELECTION ────────────────────────────────────
  if (!path) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-800 mb-2">Welcome to AI Career Guidance Agent</h1>
          <p className="text-gray-500 text-lg">Let's personalize your experience. Where are you right now?</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => setPath('CONFUSED')}
            className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 hover:border-indigo-400 hover:shadow-md transition text-left group"
          >
            <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-200 transition">
              <Lightbulb size={28} className="text-orange-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">I am confused</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Not sure which career path to take? Answer a few questions and our AI will find the best career match for you.
            </p>
            <div className="flex items-center gap-1 mt-4 text-indigo-600 font-semibold text-sm">
              Find my career <ChevronRight size={16} />
            </div>
          </button>

          <button
            onClick={() => setPath('HAS_IDEA')}
            className="bg-white rounded-2xl p-8 shadow-sm border-2 border-gray-100 hover:border-teal-400 hover:shadow-md transition text-left group"
          >
            <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition">
              <Briefcase size={28} className="text-teal-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">I have something in mind</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Already have a career in mind? Tell us about yourself and we'll show you exactly where you stand and what to learn next.
            </p>
            <div className="flex items-center gap-1 mt-4 text-teal-600 font-semibold text-sm">
              Guide me forward <ChevronRight size={16} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // ─── STEP QUESTIONS ────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-8">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => { if (step === 0) setPath(null); else setStep(step - 1); }}
            className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft size={18} className="text-gray-500" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${path === 'CONFUSED' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>
                {path === 'CONFUSED' ? 'Career Finder' : 'Quick Profile'}
              </span>
              <span className="text-xs text-gray-400">Step {step + 1} of {steps.length}</span>
            </div>
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= step ? (path === 'CONFUSED' ? 'bg-orange-500' : 'bg-teal-500') : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{currentStep.title}</h2>
          {currentStep.subtitle && (
            <p className="text-gray-400 text-sm">{currentStep.subtitle}</p>
          )}
        </div>

        <div className="mb-8">{currentStep.content}</div>

        <button
          onClick={handleNext}
          disabled={loading}
          className={`w-full font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60
            ${path === 'CONFUSED'
              ? 'bg-orange-500 hover:bg-orange-600 text-white'
              : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {isLast ? 'Analyzing...' : 'Loading...'}
            </>
          ) : (
            <>
              {isLast ? (path === 'CONFUSED' ? 'Find My Career' : 'Show My Path') : 'Continue'}
              <ChevronRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default OnboardingPage;