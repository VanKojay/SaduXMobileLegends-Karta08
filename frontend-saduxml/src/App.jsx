import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Verify from './pages/Verify';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/admin/Dashboard';
import TeamManagement from './pages/admin/TeamManagement';
import StageManagement from './pages/admin/StageManagement';
import GroupManagement from './pages/admin/GroupManagement';
import MatchManagement from './pages/admin/MatchManagement';
import MatchRoundManagement from './pages/admin/MatchRoundManagement';
import Bracket from './pages/Bracket';

// Protected Route untuk user biasa
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Protected Route untuk admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/bracket" element={<Bracket />} />

          {/* User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/teams"
            element={
              <AdminRoute>
                <TeamManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/stages"
            element={
              <AdminRoute>
                <StageManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/groups"
            element={
              <AdminRoute>
                <GroupManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/matches"
            element={
              <AdminRoute>
                <MatchManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/match-rounds"
            element={
              <AdminRoute>
                <MatchRoundManagement />
              </AdminRoute>
            }
          />

          {/* 404 Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#fff',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
