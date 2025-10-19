import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  // Deteksi scroll untuk efek backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll ke section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg border-b border-indigo-500/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">
                <span className="text-indigo-400">Sadu</span>
                <span className="text-white">X</span>
              </h1>
              <span className="text-xs text-gray-400 -mt-1">Mobile Legends</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-gray-300 hover:text-indigo-400 transition-colors text-sm font-medium"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-indigo-400 transition-colors text-sm font-medium"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-indigo-400 transition-colors text-sm font-medium"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-gray-300 hover:text-indigo-400 transition-colors text-sm font-medium"
            >
              FAQ
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  {isAdmin() ? (
                    <Shield className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span>{user?.name || user?.email}</span>
                </div>
                {isAdmin() ? (
                  <a
                    href="/admin"
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg text-sm font-medium transition-colors"
                  >
                    Admin Panel
                  </a>
                ) : (
                  <a
                    href="/dashboard"
                    className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    My Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Login
                </button>
                <button
                  onClick={onRegisterClick}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/30 transition-all hover:scale-105"
                >
                  Daftar Sekarang
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-900/98 backdrop-blur-lg border-t border-indigo-500/20">
          <div className="px-4 py-6 space-y-4">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left text-gray-300 hover:text-indigo-400 transition-colors py-2"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left text-gray-300 hover:text-indigo-400 transition-colors py-2"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left text-gray-300 hover:text-indigo-400 transition-colors py-2"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left text-gray-300 hover:text-indigo-400 transition-colors py-2"
            >
              FAQ
            </button>
            
            <div className="pt-4 border-t border-gray-700 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-2 text-sm text-gray-300 py-2">
                    <User className="w-4 h-4" />
                    <span>{user?.name || user?.email}</span>
                  </div>
                  {isAdmin() ? (
                    <a
                      href="/admin"
                      className="block w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg text-center font-medium"
                    >
                      Admin Panel
                    </a>
                  ) : (
                    <a
                      href="/dashboard"
                      className="block w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-center font-medium"
                    >
                      My Dashboard
                    </a>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-red-500/10 text-red-400 rounded-lg font-medium border border-red-500/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      onLoginClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-center font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      onRegisterClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg text-center font-medium"
                  >
                    Daftar Sekarang
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
