import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, Trophy, Users, Layers, Gamepad2, Grid3x3, GitBranch } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { path: '/admin', icon: Trophy, label: 'Dashboard' },
    { path: '/admin/teams', icon: Users, label: 'Teams' },
    { path: '/admin/stages', icon: Layers, label: 'Stages' },
    { path: '/admin/groups', icon: Grid3x3, label: 'Groups' },
    { path: '/admin/matches', icon: Gamepad2, label: 'Matches' },
    { path: '/admin/match-rounds', icon: GitBranch, label: 'Match Rounds' },
    { path: '/bracket', icon: Trophy, label: 'Bracket' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900/90 backdrop-blur-lg border-r border-gray-800 transition-all duration-300 fixed h-full z-30`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-2">
              {isSidebarOpen && (
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xl">S</span>
                  </div>
                  <div>
                    <span className="text-lg font-bold block">Admin Panel</span>
                    <span className="text-xs text-gray-400">SaduX ML</span>
                  </div>
                </div>
              )}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
                aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                      : 'hover:bg-gray-800 text-gray-300 hover:text-white'
                  }`}
                  title={!isSidebarOpen ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-indigo-400' : ''}`} />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-800">
            {isSidebarOpen && (
              <div className="mb-3 px-2">
                <div className="text-xs text-gray-500 mb-1">Logged in as</div>
                <div className="text-sm font-semibold truncate">{user?.name || user?.email}</div>
                <div className="text-xs text-gray-400 truncate">{user?.email}</div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
              title={!isSidebarOpen ? 'Logout' : ''}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } transition-all duration-300 min-h-screen`}
      >
        {/* Page Header */}
        {(title || subtitle) && (
          <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {title && <h1 className="text-2xl sm:text-3xl font-bold mb-1">{title}</h1>}
              {subtitle && <p className="text-gray-400 text-sm sm:text-base">{subtitle}</p>}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
