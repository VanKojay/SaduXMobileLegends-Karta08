import { useState } from 'react';
import { X, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import apiLogger from '../../utils/logger';

const LoginModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Login submit started', { email: formData.email });
    setErrors({});
    setIsLoading(true);

    try {
      // Basic validation
      const newErrors = {};
      if (!formData.email) {
        newErrors.email = 'Email wajib diisi';
      }
      if (!formData.password) {
        newErrors.password = 'Password wajib diisi';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsLoading(false);
        toast.error('Mohon isi semua field', { duration: 5000 });
        return;
      }

      // Call login API
      console.log('Calling login API...');
      const result = await login(formData);
      console.log('Login result:', result);
      setIsLoading(false);

      if (result.success) {
        toast.success('Login berhasil!', { duration: 3000 });
        onClose();
        
        // Redirect based on role dengan delay untuk toast
        setTimeout(() => {
          if (result.data.role === 'admin' || result.data.isAdmin) {
            window.location.href = '/admin';
          } else {
            window.location.href = '/dashboard';
          }
        }, 500);
      } else {
        const errorMsg = result.error || 'Login gagal. Periksa email dan password Anda.';
        toast.error(errorMsg, { duration: 6000 });
        setErrors({ general: errorMsg });
        console.error('Login failed:', errorMsg);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setIsLoading(false);
      const errorMsg = 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(errorMsg, { duration: 6000 });
      setErrors({ general: errorMsg });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Login</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* General Error */}
          {errors.general && (
            <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                placeholder="team@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 pr-12 py-3 bg-gray-800 border ${
                  errors.password ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 space-y-3">
          <p className="text-center text-sm text-gray-400">
            Belum punya akun?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
            >
              Daftar sekarang
            </button>
          </p>
          
          {/* Debug Tools */}
          <div className="flex items-center justify-center space-x-2 pt-2 border-t border-gray-800">
            <button
              onClick={() => {
                apiLogger.downloadLogsAsText();
                toast.success('Logs downloaded!');
              }}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>Download Logs</span>
            </button>
            <button
              onClick={() => {
                apiLogger.clearLogs();
                toast.success('Logs cleared!');
              }}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded text-xs transition-colors"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
