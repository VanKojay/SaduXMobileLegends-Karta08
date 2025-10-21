import { useRef, useEffect } from 'react';
import { X, Calendar, Users, MapPin, Trophy, FileText, Clock, User } from 'lucide-react';

const EventDetailModal = ({ isOpen, onClose, event }) => {
  const modalRef = useRef(null);

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

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  // Format datetime
  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const dateOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    return `${date.toLocaleDateString('id-ID', dateOptions)} - ${date.toLocaleTimeString('id-ID', timeOptions)}`;
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      open: 'bg-green-500/20 text-green-400 border-green-500/30',
      closed: 'bg-red-500/20 text-red-400 border-red-500/30',
      ongoing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      finished: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return styles[status] || styles.open;
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return '🟢';
      case 'closed':
        return '🔴';
      case 'ongoing':
        return '🔵';
      case 'finished':
        return '⚫';
      default:
        return '🟢';
    }
  };

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <div>
            <h2 className="text-2xl font-bold text-white">{event.title}</h2>
            <p className="text-sm text-gray-400 mt-1">Event Details</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Teams */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <label className="text-xs text-gray-500 uppercase mb-2 block">Status</label>
              <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(event.status)}`}>
                <span>{getStatusIcon(event.status)}</span>
                <span className="uppercase">{event.status}</span>
              </span>
            </div>

            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <label className="text-xs text-gray-500 uppercase mb-2 flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>Teams Registration</span>
              </label>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-white">{event.registered_teams}</span>
                <span className="text-gray-400">/ {event.max_teams}</span>
              </div>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                  style={{ width: `${(event.registered_teams / event.max_teams) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <span>Schedule</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm text-gray-400">Technical Meeting</label>
                  <p className="text-white">{formatDateTime(event.technical_meeting_date)}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <label className="text-sm text-gray-400">Match Date</label>
                  <p className="text-white font-semibold">{formatDate(event.match_date)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Venue */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-indigo-400" />
              <span>Venue</span>
            </h3>
            <p className="text-white">{event.venue}</p>
          </div>

          {/* Prizes */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-indigo-400" />
              <span>Prizes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1st Place */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium text-yellow-400">1st Place</span>
                </div>
                <p className="text-xl font-bold text-white">{event.prize_first || '-'}</p>
              </div>

              {/* 2nd Place */}
              <div className="bg-gradient-to-br from-gray-400/10 to-gray-500/10 border border-gray-400/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-gray-300" />
                  <span className="text-sm font-medium text-gray-300">2nd Place</span>
                </div>
                <p className="text-xl font-bold text-white">{event.prize_second || '-'}</p>
              </div>

              {/* 3rd Place */}
              <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Trophy className="w-5 h-5 text-orange-400" />
                  <span className="text-sm font-medium text-orange-400">3rd Place</span>
                </div>
                <p className="text-xl font-bold text-white">{event.prize_third || '-'}</p>
              </div>
            </div>
          </div>

          {/* Requirements */}
          {event.requirements && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Requirements</span>
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap">{event.requirements}</p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <span>Description</span>
              </h3>
              <p className="text-gray-300 whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500 flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>Created By</span>
                </label>
                <p className="text-white">{event.created_by || 'Admin'}</p>
              </div>

              <div>
                <label className="text-gray-500 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Created At</span>
                </label>
                <p className="text-white">{formatDate(event.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
