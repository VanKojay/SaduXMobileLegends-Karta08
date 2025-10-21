import { useState, useRef, useEffect } from 'react';
import { X, Calendar, Users, MapPin, Trophy, FileText, DollarSign, AlertCircle } from 'lucide-react';
import { eventService } from '../../services/api';
import toast from 'react-hot-toast';

const AddEventModal = ({ isOpen, onClose, onSuccess }) => {
  const modalRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    title: '',
    max_teams: '',
    status: 'open',
    technical_meeting_date: '',
    match_date: '',
    venue: '',
    prize_first: '',
    prize_second: '',
    prize_third: '',
    requirements: '',
    description: ''
  });

  // Close on ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title || formData.title.trim().length < 3) {
      newErrors.title = 'Event title minimal 3 karakter';
    }

    if (!formData.max_teams || parseInt(formData.max_teams) < 2) {
      newErrors.max_teams = 'Minimal 2 teams';
    }

    if (!formData.match_date) {
      newErrors.match_date = 'Match date wajib diisi';
    }

    if (!formData.venue || formData.venue.trim().length < 3) {
      newErrors.venue = 'Venue minimal 3 karakter';
    }

    if (!formData.prize_first || formData.prize_first.trim().length === 0) {
      newErrors.prize_first = 'Prize 1st place wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      toast.error('Mohon periksa form Anda', { duration: 5000 });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert max_teams to number
      const eventData = {
        ...formData,
        max_teams: parseInt(formData.max_teams)
      };

      await eventService.createEvent(eventData);
      toast.success('Event berhasil dibuat!', { duration: 3000 });

      // Reset form
      setFormData({
        title: '',
        max_teams: '',
        status: 'open',
        technical_meeting_date: '',
        match_date: '',
        venue: '',
        prize_first: '',
        prize_second: '',
        prize_third: '',
        requirements: '',
        description: ''
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating event:', error);
      const errorMsg = error.response?.data?.message || 'Gagal membuat event';
      toast.error(errorMsg, { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-white">Add New Event</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Event Information */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Event Information</span>
            </h3>

            {/* Event Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Tournament Mobile Legends Season 5"
                className={`w-full px-4 py-2 bg-gray-900/50 border ${
                  errors.title ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.title}</span>
                </p>
              )}
            </div>
          </div>

          {/* Capacity & Status */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-indigo-400" />
              <span>Capacity & Status</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Max Teams */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Teams <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="max_teams"
                  value={formData.max_teams}
                  onChange={handleChange}
                  placeholder="e.g., 22"
                  min="2"
                  className={`w-full px-4 py-2 bg-gray-900/50 border ${
                    errors.max_teams ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
                {errors.max_teams && (
                  <p className="mt-1 text-sm text-red-400">{errors.max_teams}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status <span className="text-red-400">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="finished">Finished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Schedule</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Technical Meeting */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technical Meeting
                </label>
                <input
                  type="datetime-local"
                  name="technical_meeting_date"
                  value={formData.technical_meeting_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Match Date */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Match Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="match_date"
                  value={formData.match_date}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-gray-900/50 border ${
                    errors.match_date ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors`}
                />
                {errors.match_date && (
                  <p className="mt-1 text-sm text-red-400">{errors.match_date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Venue */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>Venue</span>
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Location <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                placeholder="e.g., Balai RW 08"
                className={`w-full px-4 py-2 bg-gray-900/50 border ${
                  errors.venue ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              />
              {errors.venue && (
                <p className="mt-1 text-sm text-red-400">{errors.venue}</p>
              )}
            </div>
          </div>

          {/* Prizes */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-indigo-400" />
              <span>Prizes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1st Place */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  1st Place <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="prize_first"
                  value={formData.prize_first}
                  onChange={handleChange}
                  placeholder="e.g., Rp 5.000.000"
                  className={`w-full px-4 py-2 bg-gray-900/50 border ${
                    errors.prize_first ? 'border-red-500' : 'border-gray-600'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors`}
                />
                {errors.prize_first && (
                  <p className="mt-1 text-sm text-red-400">{errors.prize_first}</p>
                )}
              </div>

              {/* 2nd Place */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  2nd Place
                </label>
                <input
                  type="text"
                  name="prize_second"
                  value={formData.prize_second}
                  onChange={handleChange}
                  placeholder="e.g., Rp 3.000.000"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* 3rd Place */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  3rd Place
                </label>
                <input
                  type="text"
                  name="prize_third"
                  value={formData.prize_third}
                  onChange={handleChange}
                  placeholder="e.g., Rp 1.500.000"
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Requirements & Description */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              <span>Additional Information</span>
            </h3>

            {/* Requirements */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Requirements
              </label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                placeholder="e.g., KTP & KK"
                rows={2}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the event details..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Event</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEventModal;
