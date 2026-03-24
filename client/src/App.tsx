import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { useAuthStore } from './store/authStore';
import { useTheme } from './hooks/useTheme';

const queryClient = new QueryClient();

const ForgotPasswordPage = lazy(() =>
  import('./pages/ForgotPasswordPage').then((module) => ({
    default: module.ForgotPasswordPage,
  })),
);
const ResetPasswordPage = lazy(() =>
  import('./pages/ResetPasswordPage').then((module) => ({
    default: module.ResetPasswordPage,
  })),
);
const DashboardLayout = lazy(() =>
  import('./components/layout/DashboardLayout').then((module) => ({
    default: module.DashboardLayout,
  })),
);
const DashboardHome = lazy(() =>
  import('./pages/DashboardHome').then((module) => ({
    default: module.DashboardHome,
  })),
);
const ExamsListPage = lazy(() =>
  import('./pages/ExamsListPage').then((module) => ({
    default: module.ExamsListPage,
  })),
);
const ResultsPage = lazy(() =>
  import('./pages/ResultsPage').then((module) => ({
    default: module.ResultsPage,
  })),
);
const CreateExamPage = lazy(() =>
  import('./pages/CreateExamPage').then((module) => ({
    default: module.CreateExamPage,
  })),
);
const UserManagementPage = lazy(() =>
  import('./pages/UserManagementPage').then((module) => ({
    default: module.UserManagementPage,
  })),
);
const ProfilePage = lazy(() =>
  import('./pages/ProfilePage').then((module) => ({
    default: module.ProfilePage,
  })),
);
const ResultDetailsPage = lazy(() =>
  import('./pages/ResultDetailsPage').then((module) => ({
    default: module.ResultDetailsPage,
  })),
);
const ExamInterfacePage = lazy(() =>
  import('./pages/ExamInterfacePage').then((module) => ({
    default: module.ExamInterfacePage,
  })),
);
const LecturerExamsPage = lazy(() =>
  import('./pages/LecturerExamsPage').then((module) => ({
    default: module.LecturerExamsPage,
  })),
);
const ExamAttemptsPage = lazy(() =>
  import('./pages/ExamAttemptsPage').then((module) => ({
    default: module.ExamAttemptsPage,
  })),
);
const GradingPage = lazy(() =>
  import('./pages/GradingPage').then((module) => ({
    default: module.GradingPage,
  })),
);

const RouteFallback = () => (
  <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
    <div className="text-sm text-foreground/60">Loading...</div>
  </div>
);

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  useTheme(); // Initialize theme detection
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/forgot-password"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ForgotPasswordPage />
              </Suspense>
            }
          />
          <Route
            path="/reset-password"
            element={
              <Suspense fallback={<RouteFallback />}>
                <ResetPasswordPage />
              </Suspense>
            }
          />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Suspense fallback={<RouteFallback />}>
                  <DashboardLayout>
                    <Routes>
                      <Route index element={<DashboardHome />} />
                      <Route path="exams" element={<ExamsListPage />} />
                      <Route path="lecturer-exams" element={<LecturerExamsPage />} />
                      <Route path="exams/:examId/attempts" element={<ExamAttemptsPage />} />
                      <Route path="grade/:attemptId" element={<GradingPage />} />
                      <Route path="create-exam" element={<CreateExamPage />} />
                      <Route path="users" element={<UserManagementPage />} />
                      <Route path="results" element={<ResultsPage />} />
                      <Route path="results/:id" element={<ResultDetailsPage />} />
                      <Route path="profile" element={<ProfilePage />} />
                    </Routes>
                  </DashboardLayout>
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:examId/attempt/:attemptId"
            element={
              <ProtectedRoute>
                <Suspense fallback={<RouteFallback />}>
                  <ExamInterfacePage />
                </Suspense>
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
