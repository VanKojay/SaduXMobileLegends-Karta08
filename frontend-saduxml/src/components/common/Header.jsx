import { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, User, Shield, Trophy, Zap, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const { isAuthenticated, user, logout, isAdminOrSuperAdmin } = useAuth();
  const mobileMenuRef = useRef(null);

  // Deteksi scroll untuk efek backdrop blur & progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;

      setIsScrolled(scrollTop > 20);
      setScrollProgress(progress);

      // Active section detection
      const sections = ['home', 'info', 'how', 'faq'];
      const scrollPosition = scrollTop + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Smooth scroll ke section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Header height offset
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Navigation items
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'info', label: 'Info Turnamen' },
    { id: 'how', label: 'Cara Daftar' },
    { id: 'faq', label: 'FAQ' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-cyan-500/20'
            : 'bg-transparent'
        }`}
      >
        {/* Scroll Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800/50">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo - Enhanced with Trophy Icon */}
            <button
              onClick={() => scrollToSection('home')}
              className="flex items-center space-x-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black leading-tight">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Sadu</span>
                  <span className="text-white">X</span>
                </h1>
                <span className="text-xs text-gray-400 -mt-0.5 font-medium">ML Tournament</span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative px-4 py-2 text-sm font-semibold transition-colors ${
                    activeSection === item.id
                      ? 'text-cyan-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                  {/* Active Indicator - Animated Underline */}
                  {activeSection === item.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-slideUp" />
                  )}
                  {/* Hover Effect */}
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-600 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              ))}

              {/* Live Bracket Link with Badge */}
              <a
                href="/bracket"
                className="relative flex items-center space-x-1 px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors group"
              >
                <Trophy className="w-4 h-4" />
                <span>Live Bracket</span>
                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 items-center justify-center">
                    <span className="text-white text-[10px] font-bold">!</span>
                  </span>
                </span>
              </a>
            </nav>

            {/* Auth Buttons - Desktop - Clean & Simple */}
            <div className="hidden lg:flex items-center space-x-2">
              {isAuthenticated ? (
                <>
                  {isAdminOrSuperAdmin() ? (
                    <a
                      href="/admin"
                      className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 rounded-lg text-sm font-bold shadow-lg shadow-yellow-500/30 transition-all hover:scale-105"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </a>
                  ) : (
                    <a
                      href="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
                    >
                      <User className="w-4 h-4" />
                      <span>Dashboard</span>
                    </a>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg text-sm font-medium transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="px-4 py-2.5 text-gray-300 hover:text-white transition-colors text-sm font-semibold"
                  >
                    Login
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="flex items-center space-x-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Daftar Sekarang</span>
                  </button>

                  {/* Slot Badge - Simplified */}
                  <div className="flex items-center space-x-1.5 px-3 py-2 bg-yellow-500/10 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-yellow-400 font-bold">70 Slot!</span>
                  </div>
                </>
              )}
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
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all ${
                        activeSection === item.id
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                      }`}
                    >
                      <span className="font-semibold">{item.label}</span>
                      {activeSection === item.id && (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  ))}

                  {/* Live Bracket */}
                  <a
                    href="/bracket"
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all"
                  >
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-4 h-4" />
                      <span className="font-semibold">Live Bracket</span>
                    </div>
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </a>
                </div>

                {/* Slot Info Badge */}
                {!isAuthenticated && (
                  <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-400">Buruan Daftar!</span>
                    </div>
                    <p className="text-xs text-gray-400">70 slot tim masih tersedia. Jangan sampai kehabisan!</p>
                  </div>
                )}
              </nav>

              {/* Auth Actions */}
              <div className="p-4 border-t border-gray-700/50 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      {isAdminOrSuperAdmin() ? (
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
                        <p className="text-xs text-gray-400">{isAdminOrSuperAdmin() ? 'Administrator' : 'Team Member'}</p>
                      </div>
                    </div>

                    {isAdminOrSuperAdmin() ? (
                      <a
                        href="/admin"
                        className="block w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-gray-900 rounded-lg text-center font-bold shadow-lg shadow-yellow-500/30 transition-all"
                      >
                        Admin Panel
                      </a>
                    ) : (
                      <a
                        href="/dashboard"
                        className="block w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-center font-bold shadow-lg shadow-cyan-500/30 transition-all"
                      >
                        My Dashboard
                      </a>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium border border-red-500/20 hover:border-red-500/40 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onRegisterClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg font-bold shadow-lg shadow-cyan-500/30 transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Daftar Sekarang</span>
                    </button>
                    <button
                      onClick={() => {
                        onLoginClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-center font-medium border border-gray-700 hover:border-gray-600 transition-all"
                    >
                      Login
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

export default Header;
