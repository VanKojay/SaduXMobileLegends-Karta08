import { Trophy, Mail, Github, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/50 backdrop-blur-lg border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  <span className="text-indigo-400">Sadu</span>
                  <span className="text-white">X</span> Mobile Legends
                </h3>
                <p className="text-xs text-gray-400">Karta08 Tournament Platform</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md">
              Platform manajemen turnamen Mobile Legends terbaik di Indonesia. 
              Bergabunglah dengan ribuan pemain lainnya dan buktikan skillmu!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#faq" className="text-gray-400 hover:text-indigo-400 text-sm transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <a
                href="mailto:support@sadux.com"
                className="flex items-center space-x-2 text-gray-400 hover:text-indigo-400 text-sm transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>support@sadux.com</span>
              </a>
              <div className="flex space-x-4 pt-2">
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-gray-800 hover:bg-indigo-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} SaduX Mobile Legends - Karta08. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
