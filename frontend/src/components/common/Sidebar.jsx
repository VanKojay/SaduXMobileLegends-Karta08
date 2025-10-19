import { useState, useEffect } from 'react';
import { LogOut, User, Shield, Home, Trophy, Info, HelpCircle, Calendar, Users as UsersIcon, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ onLoginClick, onRegisterClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const [hoverTimeout, setHoverTimeout] = useState(null);

  // Detect active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'schedule', 'about', 'faq'];
      const scrollPosition = window.scrollY + 100;

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

  // Smooth scroll ke section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Handle hover with delay - 2 seconds before expanding
  const handleMouseEnter = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => {
      setIsOpen(true);
    }, 500); // 2 seconds delay before expanding
    setHoverTimeout(timeout);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 500); // 500ms delay before collapsing
    setHoverTimeout(timeout);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, desc: 'Halaman utama' },
    { id: 'info', label: 'Info Turnamen', icon: Sparkles, desc: 'Detail turnamen' },
    { id: 'how', label: 'Cara Daftar', icon: Calendar, desc: '3 langkah mudah' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, desc: 'Pertanyaan umum' },
  ];

  return (
    <>
      {/* Sidebar - Always Visible with Hover Trigger */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 border-r border-gray-700/50 shadow-2xl z-40 transition-all duration-500 ease-in-out ${
          isOpen ? 'w-80' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header Section - Compact & Clean */}
          <div className={`border-b border-gray-700/50 transition-all duration-500 ease-in-out ${isOpen ? 'p-4' : 'p-3'}`}>
            <div className="flex items-center h-11">
              <div className="w-11 h-11 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 flex-shrink-0">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className={`overflow-hidden transition-all duration-500 ease-in-out ml-3 ${
                isOpen ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0 ml-0'
              }`}>
                <h1 className="text-base font-black leading-tight whitespace-nowrap">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">SaduX</span>
                </h1>
                <p className="text-xs text-gray-500 whitespace-nowrap">ML Tournament</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu - Improved Spacing */}
          <nav className="flex-1 overflow-y-auto py-4">
            {/* Menu Header - Only show when expanded */}
            {isOpen && (
              <div className="mb-3 px-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Navigation</p>
              </div>
            )}
            
            <div className="space-y-1 px-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    title={!isOpen ? item.label : ''}
                    className={`relative group w-full h-12 flex items-center justify-center rounded-lg transition-all duration-500 ease-in-out ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400'
                        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                    }`}
                  >
                    {isOpen ? (
                      <>
                        <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-500 ease-in-out ${isActive ? 'text-cyan-400' : ''}`} />
                        <div className="flex flex-col items-start flex-1 min-w-0 ml-3 overflow-hidden transition-opacity duration-500 ease-in-out">
                          <span className={`font-semibold text-sm leading-tight whitespace-nowrap ${isActive ? 'text-cyan-400' : ''}`}>
                            {item.label}
                          </span>
                          <span className="text-xs text-gray-500 leading-tight whitespace-nowrap">{item.desc}</span>
                        </div>
                      </>
                    ) : (
                      <Icon className={`w-5 h-5 transition-all duration-500 ease-in-out ${isActive ? 'text-cyan-400' : ''}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-4 mx-3 border-t border-gray-700/30"></div>

            {/* Quick Actions Header - Only show when expanded */}
            {isOpen && (
              <div className="mb-3 px-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Quick Access</p>
              </div>
            )}

            {/* Additional Links */}
            <div className="space-y-1 px-2">
              <a
                href="/bracket"
                title={!isOpen ? 'Live Bracket' : ''}
                className="group w-full h-12 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition-all duration-500 ease-in-out"
              >
                {isOpen ? (
                  <>
                    <Trophy className="w-5 h-5 flex-shrink-0 transition-all duration-500 ease-in-out" />
                    <div className="flex flex-col items-start flex-1 min-w-0 ml-3 overflow-hidden transition-opacity duration-500 ease-in-out">
                      <span className="font-semibold text-sm leading-tight whitespace-nowrap">Live Bracket</span>
                      <span className="text-xs text-gray-500 leading-tight whitespace-nowrap">Lihat pertandingan</span>
                    </div>
                  </>
                ) : (
                  <Trophy className="w-5 h-5 transition-all duration-500 ease-in-out" />
                )}
              </a>
            </div>
          </nav>

          {/* Footer - User Info & Auth */}
          <div className={`border-t border-gray-700/50 transition-all duration-500 ease-in-out ${isOpen ? 'p-4' : 'p-3'}`}>
            {isAuthenticated ? (
              <>
                {isOpen ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-2 py-2">
                      {isAdmin() ? (
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-white" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{user?.name || user?.email}</p>
                        <p className="text-xs text-gray-500">{isAdmin() ? 'Admin' : 'User'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {isAdmin() ? (
                        <a
                          href="/admin"
                          className="block w-full px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded-lg text-center text-sm font-semibold transition-colors border border-yellow-500/20"
                        >
                          Admin Panel
                        </a>
                      ) : (
                        <a
                          href="/dashboard"
                          className="block w-full px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg text-center text-sm font-semibold transition-colors border border-indigo-500/20"
                        >
                          Dashboard
                        </a>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    {isAdmin() ? (
                      <div className="w-11 h-11 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {isOpen ? (
                  <div className="space-y-2">
                    <button
                      onClick={onRegisterClick}
                      className="w-full px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all"
                    >
                      Daftar Sekarang
                    </button>
                    <button
                      onClick={onLoginClick}
                      className="w-full px-3 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors border border-gray-700"
                    >
                      Login
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={onRegisterClick}
                      className="w-11 h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all"
                      title="Daftar"
                    >
                      <User className="w-6 h-6 text-white" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
