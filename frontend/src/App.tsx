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
import "./services/api/apiTest"; // Import to run API tests
import { ThemeProvider } from "./context/ThemeProvider";

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};



// Main App Routes
const AppRoutes: React.FC = () => {
  
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/manage-sites" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/manage-sites" replace />
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
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/manage-sites" replace />
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
        <ThemeProvider>
          <div className="App">
            {/* Skip Links for WCAG 2.2 compliance */}
            <a href="#main-content" className="skip-to-content">
              Skip to main content
            </a>
            <a href="#navigation" className="skip-to-content">
              Skip to navigation
            </a>
            <AppRoutes />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
