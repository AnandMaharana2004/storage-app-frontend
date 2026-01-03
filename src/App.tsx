import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Dashboard from "./Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import PublicFileView from "./components/PublicFileView";
import { UserProvider, useUser } from "./context/UserContext";
import { FileSystemProvider } from "./context/FileSystemContext";
import { AdminProvider } from "./context/AdminContext";

// Global Loader Component
const GlobalLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-brand-500/20 rounded-3xl blur-2xl animate-pulse-slow"></div>
      <div className="w-20 h-20 bg-brand-600 rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-2xl relative z-10 animate-bounce">
        Z
      </div>
    </div>
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300 font-semibold tracking-wide">
        <Loader2 className="animate-spin text-brand-500" size={24} />
        <span>Initializing CloudZoon...</span>
      </div>
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">
        Securing your workspace
      </p>
    </div>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({
  children,
  requireAdmin = false,
}: {
  children?: React.ReactNode;
  requireAdmin?: boolean;
}) => {
  const { isAuthenticated, isLoading, user } = useUser();

  if (isLoading) return <GlobalLoader />;
  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  if (requireAdmin && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <div className="animate-in fade-in duration-700">{children}</div>;
};

// Public Route Wrapper
const PublicRoute = ({ children }: { children?: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loader2 className="animate-spin text-brand-600" size={40} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route
        path="/sign-in"
        element={
          <PublicRoute>
            <SignIn />
          </PublicRoute>
        }
      />
      <Route
        path="/sign-up"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />
      <Route
        path="/forgot-password"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />

      {/* Public Shared Link Route */}
      <Route path="/s/:fileId/:token" element={<PublicFileView />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminProvider>
              <Dashboard />
            </AdminProvider>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/details/:userId"
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminProvider>
              <Dashboard />
            </AdminProvider>
          </ProtectedRoute>
        }
      />

      {/* Protected User Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/recent"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/starred"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/shared"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trash"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/folder/:folderId"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <FileSystemProvider>
          <AppRoutes />
        </FileSystemProvider>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
