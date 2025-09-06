import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { EnterUrlPage } from "./pages/EnterUrlPage";
import { ManageSites } from "./pages/ManageSites";
import "./App.css";
import { EditProfile } from "./pages/EditProfile";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading, userSites } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getInitialRedirectPath = () => {
    if (!isAuthenticated) return "/login";
    if (userSites.length > 0) return "/manage-sites";
    return "/enter-url";
  };

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};



// Main App Routes
const AppRoutes: React.FC = () => {
  
  const { isAuthenticated, userSites } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            userSites.length > 0 ? (
              <Navigate to="/manage-sites" replace />
            ) : (
              <Navigate to="/enter-url" replace />
            )
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            userSites.length > 0 ? (
              <Navigate to="/manage-sites" replace />
            ) : (
              <Navigate to="/enter-url" replace />
            )
          ) : (
            <RegisterPage />
          )
        }
      />

      <Route
        path="/enter-url"
        element={
          <ProtectedRoute>
            <EnterUrlPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/:siteId"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage-sites"
        element={
          <ProtectedRoute>
            <ManageSites />
          </ProtectedRoute>
        }
      />
       <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            userSites.length > 0 ? (
              <Navigate to="/manage-sites" replace />
            ) : (
              <Navigate to="/enter-url" replace />
            )
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

// Main App component
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
