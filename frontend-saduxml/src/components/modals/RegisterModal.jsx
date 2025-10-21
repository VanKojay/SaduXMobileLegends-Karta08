import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, AlertCircle, Loader2, Eye, EyeOff, CheckCircle, Download, Calendar, Users as UsersIcon, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validateTeamRegistration } from '../../utils/validators';
import { eventService } from '../../services/api';
import toast from 'react-hot-toast';
import apiLogger from '../../utils/logger';

const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    event_id: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const { register } = useAuth();

  // Fetch active events when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchActiveEvents();
    }
  }, [isOpen]);

  const fetchActiveEvents = async () => {
    try {
      setIsLoadingEvents(true);
      const response = await eventService.listEvents();

      // Filter events yang open & belum deadline & masih ada slot
      const activeEvents = response.data.filter(event => {
        const isOpen = event.status === 'open';
        const notExpired = !event.registration_deadline ||
                           new Date(event.registration_deadline) > new Date();
        const hasSlot = (event.registered_teams || 0) < event.max_teams;

        return isOpen && notExpired && hasSlot;
      });

      setEvents(activeEvents);

      // Auto-select jika hanya ada 1 event
      if (activeEvents.length === 1) {
        setFormData(prev => ({ ...prev, event_id: activeEvents[0].id }));
        setSelectedEvent(activeEvents[0]);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Gagal memuat daftar event');
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error saat user mulai mengetik
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const labels = ['Sangat Lemah', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];

    return {
      strength: (strength / 5) * 100,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-500',
    };
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Form submit started', formData);
    setErrors({});
    setIsLoading(true);

    try {
      // Validate form
      const validation = validateTeamRegistration(formData);
      console.log('Validation result:', validation);
      
      if (!validation.isValid) {
        setErrors(validation.errors);
        setIsLoading(false);
        toast.error('Mohon periksa form Anda', { duration: 5000 });
        return;
      }

      // Call register API
      console.log('Calling register API...');
      const result = await register({
        event_id: formData.event_id,
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      console.log('Register result:', result);
      setIsLoading(false);

      if (result.success) {
        setIsSuccess(true);
        toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.', { duration: 6000 });
      } else {
        const errorMsg = result.error || 'Registrasi gagal. Silakan coba lagi.';
        toast.error(errorMsg, { duration: 6000 });
        setErrors({ general: errorMsg });
        console.error('Registration failed:', errorMsg);
      }
    } catch (error) {
      console.error('Submit error:', error);
      setIsLoading(false);
      const errorMsg = 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(errorMsg, { duration: 6000 });
      setErrors({ general: errorMsg });
    }
  };

  // Handle close after success
  const handleSuccessClose = () => {
    setIsSuccess(false);
    setFormData({
      event_id: '',
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setSelectedEvent(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {isSuccess ? 'Registrasi Berhasil!' : 'Daftar Team'}
          </h2>
          <button
            onClick={isSuccess ? handleSuccessClose : onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Email Verifikasi Terkirim</h3>
            <p className="text-gray-400 mb-6">
              Kami telah mengirim link verifikasi ke email <span className="text-indigo-400">{formData.email}</span>. 
              Silakan cek inbox atau folder spam Anda.
            </p>
            <button
              onClick={handleSuccessClose}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02]"
            >
              Mengerti
            </button>
          </div>
        ) : (
          <>
            {/* Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{errors.general}</p>
                </div>
              )}

              {/* Event Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pilih Event <span className="text-red-400">*</span>
                </label>

                {isLoadingEvents ? (
                  <div className="flex items-center justify-center py-8 bg-gray-800 rounded-lg border border-gray-700">
                    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mr-2" />
                    <span className="text-gray-400">Memuat event...</span>
                  </div>
                ) : events.length === 0 ? (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <p className="text-sm text-red-400 text-center">
                      Tidak ada event aktif saat ini. Silakan coba lagi nanti.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {events.map((event) => {
                      const slotsLeft = event.max_teams - (event.registered_teams || 0);
                      const deadlineDate = event.registration_deadline
                        ? new Date(event.registration_deadline).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })
                        : 'Tidak ada deadline';

                      return (
                        <label
                          key={event.id}
                          className={`block p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.event_id === event.id
                              ? 'border-indigo-500 bg-indigo-500/10'
                              : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="event_id"
                            value={event.id}
                            checked={formData.event_id === event.id}
                            onChange={(e) => {
                              setFormData(prev => ({ ...prev, event_id: parseInt(e.target.value) }));
                              setSelectedEvent(event);
                              if (errors.event_id) {
                                setErrors(prev => ({ ...prev, event_id: '' }));
                              }
                            }}
                            className="sr-only"
                          />
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`font-bold text-base mb-2 ${
                                formData.event_id === event.id ? 'text-indigo-400' : 'text-white'
                              }`}>
                                {event.title}
                              </h3>
                              <div className="space-y-1 text-xs text-gray-400">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="w-3 h-3" />
                                  <span>Deadline: {deadlineDate}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <UsersIcon className="w-3 h-3" />
                                  <span className={slotsLeft < 10 ? 'text-yellow-400 font-semibold' : ''}>
                                    Slot: {slotsLeft}/{event.max_teams} tersisa
                                  </span>
                                </div>
                                {event.venue && (
                                  <div className="flex items-center space-x-2">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.venue}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            {formData.event_id === event.id && (
                              <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0 ml-2" />
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}

                {errors.event_id && (
                  <p className="mt-1 text-sm text-red-400">{errors.event_id}</p>
                )}
              </div>

              {/* Team Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Team <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                    placeholder="Nama team kamu"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
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
                  Password <span className="text-red-400">*</span>
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
                    placeholder="Minimal 8 karakter"
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">Kekuatan Password</span>
                      <span className="text-xs text-gray-400">{passwordStrength.label}</span>
                    </div>
                    <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Konfirmasi Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-800 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all`}
                    placeholder="Ketik ulang password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
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
                    <span>Mendaftar...</span>
                  </>
                ) : (
                  <span>Daftar Sekarang</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="px-6 pb-6 space-y-3">
              <p className="text-center text-sm text-gray-400">
                Sudah punya akun?{' '}
                <button
                  onClick={onSwitchToLogin}
                  className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                >
                  Login di sini
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
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterModal;
