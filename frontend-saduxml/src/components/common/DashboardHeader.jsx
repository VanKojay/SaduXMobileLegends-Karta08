import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, Trophy, Home, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardHeader = ({ title = 'Dashboard', subtitle = 'Team Management' }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const mobileMenuRef = useRef(null);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNavigateHome = () => {
    navigate('/');
  };

  const handleNavigateBracket = () => {
    navigate('/bracket');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            {/* Logo & Breadcrumb */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <button
                onClick={handleNavigateHome}
                className="flex items-center space-x-2 sm:space-x-3 group"
                aria-label="Go to home"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                    <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="hidden sm:flex flex-col">
                  <h1 className="text-lg sm:text-xl font-black leading-tight">
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Sadu</span>
                    <span className="text-white">X</span>
                  </h1>
                  <span className="text-xs text-gray-400 -mt-0.5 font-medium">ML Tournament</span>
                </div>
              </button>

              {/* Breadcrumb - Desktop */}
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <button
                  onClick={handleNavigateHome}
                  className="text-gray-400 hover:text-cyan-400 transition-colors font-medium"
                >
                  Home
                </button>
                <ChevronRight className="w-4 h-4 text-gray-600" />
                <span className="text-cyan-400 font-semibold">{title}</span>
              </div>
            </div>

            {/* Desktop Actions - Clean & Simple */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* View Bracket Button */}
              <button
                onClick={handleNavigateBracket}
                className="flex items-center space-x-2 px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-semibold transition-all hover:scale-105"
              >
                <Trophy className="w-4 h-4" />
                <span>Live Bracket</span>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel - Slide from right */}
          <div
            ref={mobileMenuRef}
            className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-l border-cyan-500/20 shadow-2xl animate-slideIn"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black">
                      <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Sadu</span>
                      <span className="text-white">X</span>
                    </h2>
                    <p className="text-xs text-gray-400">ML Tournament</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-4">
                <div className="space-y-2">
                  {/* Home */}
                  <button
                    onClick={() => {
                      handleNavigateHome();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
                  >
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">Kembali ke Home</span>
                  </button>

                  {/* Dashboard - Current Page */}
                  <div className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    <User className="w-5 h-5" />
                    <span className="font-semibold">{title}</span>
                  </div>

                  {/* Live Bracket */}
                  <button
                    onClick={() => {
                      handleNavigateBracket();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold">Live Bracket</span>
                    </div>
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </button>
                </div>
              </nav>

              {/* Auth Actions */}
              <div className="p-4 border-t border-gray-700/50 space-y-3">
                {isAuthenticated && (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      {isAdmin() ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.name || user?.email}</p>
                        <p className="text-xs text-gray-400">{isAdmin() ? 'Administrator' : 'Team Member'}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium border border-red-500/20 hover:border-red-500/40 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
