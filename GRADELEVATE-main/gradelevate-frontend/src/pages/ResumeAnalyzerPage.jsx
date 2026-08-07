import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { uploadResume, getMyResumes, getResumeAnalysis } from '../api/resumeApi';
import { FileText, Upload, ArrowLeft, TrendingUp, Briefcase, BookOpen, Cpu, LogOut, CheckCircle, AlertCircle, Star, Lightbulb, Target, ClipboardList } from 'lucide-react';

const ResumeAnalyzerPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [parsedAnalysis, setParsedAnalysis] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [showJD, setShowJD] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => { fetchResumes(); }, []);

  const fetchResumes = async () => {
    try {
      const res = await getMyResumes();
      setResumes(res.data);
    } catch {
      toast.error('Failed to load resumes');
    }
  };

    const tryParseJson = (raw) => {
    if (!raw) return null;
    try {
        // Attempt 1: direct parse
        return JSON.parse(raw);
    } catch {
        try {
        // Attempt 2: strip markdown code blocks
        let cleaned = raw.trim();
        if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
        else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
        if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
        return JSON.parse(cleaned.trim());
        } catch {
        try {
            // Attempt 3: find first { to last }
            const start = raw.indexOf('{');
            const end = raw.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
            return JSON.parse(raw.slice(start, end + 1));
            }
        } catch {
            try {
            // Attempt 4: replace smart quotes with regular quotes
            const fixed = raw
                .replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"')
                .replace(/\n/g, ' ')
                .trim();
            const start = fixed.indexOf('{');
            const end = fixed.lastIndexOf('}');
            if (start !== -1 && end !== -1) {
                return JSON.parse(fixed.slice(start, end + 1));
            }
            } catch {
            return null;
            }
        }
        }
    }
    return null;
    };

  const handleFileSelect = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.pdf')) { toast.error('Only PDF files are allowed'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB'); return; }
    setSelectedFile(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) { toast.error('Please select a PDF file first'); return; }
    setUploading(true);
    try {
      const res = await uploadResume(selectedFile, jobDescription);
      toast.success('Resume analyzed successfully!');
      setSelectedFile(null);
      setJobDescription('');
      setShowJD(false);
      await fetchResumes();
      processResume(res.data);
    } catch {
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const processResume = (resume) => {
    setSelectedResume(resume);
    setParsedAnalysis(null);
    if (resume.analysis?.aiFeedback) {
      const parsed = tryParseJson(resume.analysis.aiFeedback);
      if (parsed) setParsedAnalysis(parsed);
    }
  };

  const handleSelectResume = async (resume) => {
    setSelectedResume(resume);
    setParsedAnalysis(null);
    if (resume.analysis?.aiFeedback) {
      const parsed = tryParseJson(resume.analysis.aiFeedback);
      if (parsed) { setParsedAnalysis(parsed); return; }
    }
    setAnalysisLoading(true);
    try {
      const res = await getResumeAnalysis(resume.id);
      const parsed = tryParseJson(res.data.aiFeedback);
      setParsedAnalysis(parsed);
    } catch {
      toast.error('Failed to load analysis');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return '#16a34a';
    if (score >= 60) return '#2563eb';
    if (score >= 40) return '#eab308';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Work';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'from-green-50 to-emerald-50 border-green-200';
    if (score >= 60) return 'from-blue-50 to-indigo-50 border-blue-200';
    if (score >= 40) return 'from-yellow-50 to-amber-50 border-yellow-200';
    return 'from-red-50 to-rose-50 border-red-200';
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { label: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
    { label: 'Careers', icon: Briefcase, path: '/careers' },
    { label: 'Skills', icon: BookOpen, path: '/skills' },
    { label: 'AI Tools', icon: Cpu, path: '/ai-tools' },
  ];

  const ScoreRing = ({ score }) => {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return (
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke={getScoreRingColor(score)} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 70 70)" />
        <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="800" fill={getScoreRingColor(score)}>{score}</text>
        <text x="70" y="82" textAnchor="middle" fontSize="11" fill="#9ca3af">/100</text>
      </svg>
    );
  };

  const BarChart = ({ items, color }) => (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 font-medium">{item.label}</span>
            <span className="text-gray-500 font-semibold">{item.value}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div className={`h-2.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${item.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );

  const hasJobMatch = parsedAnalysis?.jobMatchScore != null;

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

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-200 rounded-lg transition">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Resume Analyzer</h2>
            <p className="text-gray-500 text-sm">Upload your resume and get AI-powered feedback</p>
          </div>
        </div>

        <div className="flex gap-6">

          {/* Left panel */}
          <div className="w-2/5 space-y-4">

            {/* Upload area */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${dragOver ? 'border-indigo-500 bg-indigo-50' : selectedFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-white hover:border-indigo-400'}`}
            >
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText size={22} className="text-green-600" />
                  </div>
                  <p className="font-semibold text-green-700 text-sm">{selectedFile.name}</p>
                  <p className="text-green-500 text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button onClick={() => setSelectedFile(null)} className="text-xs text-gray-400 hover:text-red-500 transition">Remove</button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                    <Upload size={22} className="text-indigo-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 text-sm">Drag and drop your resume</p>
                    <p className="text-gray-400 text-xs mt-0.5">or click to browse</p>
                  </div>
                  <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-5 py-2 rounded-lg transition">
                    Choose PDF
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileSelect(e.target.files[0])} />
                  </label>
                  <p className="text-xs text-gray-400">PDF only, max 5MB</p>
                </div>
              )}
            </div>

            {/* Job description toggle */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <button
                onClick={() => setShowJD(!showJD)}
                className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 hover:text-indigo-600 transition"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList size={16} className="text-indigo-500" />
                  Add Job Description
                  <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full font-medium">Optional</span>
                </span>
                <span className="text-gray-400 text-lg">{showJD ? '−' : '+'}</span>
              </button>

              {showJD && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-400">Paste the job description to get a tailored analysis and ATS score</p>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={6}
                    className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-gray-700 placeholder-gray-300"
                  />
                  {jobDescription && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle size={12} />
                        Job description added
                      </span>
                      <button onClick={() => setJobDescription('')} className="text-gray-400 hover:text-red-500 transition">Clear</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Analyze button */}
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || uploading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <Target size={18} />
                  {jobDescription.trim() ? 'Analyze vs Job Description' : 'Analyze Resume'}
                </>
              )}
            </button>

            {/* Previous resumes */}
            {resumes.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <h3 className="font-semibold text-gray-700 text-sm mb-3">Previous Resumes</h3>
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      onClick={() => handleSelectResume(resume)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${selectedResume?.id === resume.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`}
                    >
                      <div className="bg-red-50 p-2 rounded-lg flex-shrink-0">
                        <FileText size={16} className="text-red-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{resume.originalFilename}</p>
                        <p className="text-xs text-gray-400">{formatDate(resume.uploadedAt)}</p>
                      </div>
                      {resume.analysis?.score > 0 && (
                        <span className={`text-sm font-bold ${getScoreColor(resume.analysis.score)}`}>
                          {resume.analysis.score}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div className="w-3/5">
            {!selectedResume ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={28} className="text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No resume selected</h3>
                <p className="text-gray-400 text-sm">Upload a new resume or select a previous one</p>
              </div>
            ) : analysisLoading ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading analysis...</p>
              </div>
            ) : parsedAnalysis ? (
              <div className="space-y-4 overflow-y-auto max-h-screen pb-8">

                {/* Score card */}
                <div className={`bg-gradient-to-br ${getScoreBg(parsedAnalysis.score)} border-2 rounded-2xl p-6`}>
                  <div className="flex items-center gap-6">
                    <ScoreRing score={parsedAnalysis.score} />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Resume Score</p>
                      <p className={`text-3xl font-black ${getScoreColor(parsedAnalysis.score)}`}>{getScoreLabel(parsedAnalysis.score)}</p>
                      {hasJobMatch && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">Job Match:</span>
                          <span className={`text-lg font-black ${getScoreColor(parsedAnalysis.jobMatchScore)}`}>{parsedAnalysis.jobMatchScore}%</span>
                        </div>
                      )}
                      {parsedAnalysis.summary && (
                        <p className="text-gray-600 text-sm mt-2 leading-relaxed">{parsedAnalysis.summary}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <h4 className="font-bold text-gray-800 mb-4 text-sm">Score Breakdown</h4>
                  <BarChart
                    items={[
                      { label: 'Overall Score', value: parsedAnalysis.score },
                      ...(hasJobMatch ? [{ label: 'Job Description Match', value: parsedAnalysis.jobMatchScore }] : []),
                      { label: 'Strengths Found', value: Math.min(100, (parsedAnalysis.strengths?.length || 0) * 25) },
                      { label: 'Sections Present', value: Math.max(0, 100 - ((parsedAnalysis.missingSections?.length || 0) * 20)) },
                    ]}
                    color={hasJobMatch ? 'bg-purple-500' : 'bg-indigo-500'}
                  />
                </div>

                {/* JD Match section — only shown when job description was provided */}
                {hasJobMatch && (
                  <div className="bg-white rounded-xl shadow-sm border border-purple-100 p-5">
                    <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <ClipboardList size={18} className="text-purple-500" />
                      Job Description Match
                      <span className={`ml-auto text-lg font-black ${getScoreColor(parsedAnalysis.jobMatchScore)}`}>{parsedAnalysis.jobMatchScore}%</span>
                    </h4>

                    {parsedAnalysis.matchedKeywords?.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Matched Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {parsedAnalysis.matchedKeywords.map((kw, i) => (
                            <span key={i} className="bg-green-50 text-green-700 border border-green-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                              <CheckCircle size={10} />{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsedAnalysis.missingKeywords?.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Missing Keywords</p>
                        <div className="flex flex-wrap gap-2">
                          {parsedAnalysis.missingKeywords.map((kw, i) => (
                            <span key={i} className="bg-red-50 text-red-600 border border-red-200 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                              <AlertCircle size={10} />{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Strengths */}
                {parsedAnalysis.strengths?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-500" />
                      Strong Points
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full ml-auto">{parsedAnalysis.strengths.length} found</span>
                    </h4>
                    <ul className="space-y-2">
                      {parsedAnalysis.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                          <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {parsedAnalysis.improvements?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <AlertCircle size={18} className="text-orange-500" />
                      Areas to Improve
                      <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full ml-auto">{parsedAnalysis.improvements.length} issues</span>
                    </h4>
                    <ul className="space-y-2">
                      {parsedAnalysis.improvements.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700 bg-orange-50 p-3 rounded-lg">
                          <AlertCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Missing sections */}
                {parsedAnalysis.missingSections?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Star size={18} className="text-yellow-500" />
                      Missing Sections
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedAnalysis.missingSections.map((s, i) => (
                        <span key={i} className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-medium px-3 py-1.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested skills */}
                {parsedAnalysis.suggestedSkills?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Lightbulb size={18} className="text-blue-500" />
                      {hasJobMatch ? 'Skills Missing from Job Description' : 'Skills to Add'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedAnalysis.suggestedSkills.map((s, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold px-3 py-1.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career suggestions */}
                {parsedAnalysis.careerSuggestions?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Target size={18} className="text-indigo-500" />
                      Suitable Careers
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {parsedAnalysis.careerSuggestions.map((s, i) => (
                        <div key={i} className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-2.5 rounded-xl flex items-center gap-2">
                          <Briefcase size={12} className="flex-shrink-0" />{s}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : selectedResume?.analysis ? (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                        <AlertCircle size={20} className="text-orange-400" />
                        <h3 className="font-bold text-gray-700">Raw AI Response</h3>
                        </div>
                        <pre className="text-xs text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
                        {selectedResume.analysis.aiFeedback}
                        </pre>
                        <p className="text-xs text-gray-400 mt-3">Share this output so we can fix the parsing.</p>
                    </div>
                    ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                        <AlertCircle size={32} className="text-orange-400 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-700 mb-2">Could not parse analysis</h3>
                        <p className="text-gray-400 text-sm">Try uploading again.</p>
                    </div>
                    )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;