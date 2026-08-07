import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';

import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import OnboardingPage     from './pages/OnboardingPage';
import DashboardPage      from './pages/DashboardPage';
import CareerExplorerPage from './pages/CareerExplorerPage';
import SkillExplorerPage  from './pages/SkillExplorerPage';
import AiToolsPage        from './pages/AiToolsPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import NotFoundPage       from './pages/NotFoundPage';
import AdminPage from './pages/AdminPage';
import SkillDetailPage from './pages/SkillDetailPage';
import CareerDetailPage from './pages/CareerDetailPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';





function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>

          {/* Public routes */}
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route path="/onboarding" element={
            <ProtectedRoute><OnboardingPage /></ProtectedRoute>
          }/>
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          }/>
          <Route path="/careers" element={
            <ProtectedRoute><CareerExplorerPage /></ProtectedRoute>
          }/>
          <Route path="/skills" element={
            <ProtectedRoute><SkillExplorerPage /></ProtectedRoute>
          }/>
          <Route path="/ai-tools" element={
            <ProtectedRoute><AiToolsPage /></ProtectedRoute>
          }/>
          <Route path="/resume" element={
            <ProtectedRoute><ResumeAnalyzerPage /></ProtectedRoute>
          }/>

          {/* Redirects */}
          <Route path="/"  element={<Navigate to="/dashboard" replace />} />
          <Route path="*"  element={<NotFoundPage />} />

          <Route path="/admin" element={
          <ProtectedRoute><AdminPage /></ProtectedRoute>
          }/>

          <Route path="/skills/:skillId" element={
          <ProtectedRoute><SkillDetailPage /></ProtectedRoute>
          }/>

          <Route path="/careers/:careerId" element={
            <ProtectedRoute><CareerDetailPage /></ProtectedRoute>
          }/>

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/verify-email" element={<VerifyEmailPage />} />


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;