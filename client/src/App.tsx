import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardHome } from './pages/DashboardHome';
import { ExamsListPage } from './pages/ExamsListPage';
import { ResultsPage } from './pages/ResultsPage';
import { CreateExamPage } from './pages/CreateExamPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ExamInterfacePage } from './pages/ExamInterfacePage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { useAuthStore } from './store/authStore';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Routes>
                    <Route index element={<DashboardHome />} />
                    <Route path="exams" element={<ExamsListPage />} />
                    <Route path="create-exam" element={<CreateExamPage />} />
                    <Route path="users" element={<UserManagementPage />} />
                    <Route path="results" element={<ResultsPage />} />
                    <Route path="profile" element={<div>Profile (To be implemented)</div>} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:examId/attempt/:attemptId"
            element={
              <ProtectedRoute>
                <ExamInterfacePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
