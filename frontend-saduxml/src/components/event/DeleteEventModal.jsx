import { useState, useRef, useEffect } from 'react';
import { X, AlertTriangle, Calendar, MapPin, Users } from 'lucide-react';
import { eventService } from '../../services/api';
import toast from 'react-hot-toast';

const DeleteEventModal = ({ isOpen, onClose, onSuccess, event }) => {
  const modalRef = useRef(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Handle delete
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await eventService.deleteEvent(event.id);
      toast.success(`"${event.title}" berhasil dihapus!`, { duration: 3000 });
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting event:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menghapus event';
      toast.error(errorMsg, { duration: 6000 });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  if (!isOpen || !event) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="bg-gray-800 rounded-2xl shadow-2xl border border-red-500/30 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Delete Event</h2>
              <p className="text-sm text-gray-400">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            disabled={isDeleting}
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning Message */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
            <p className="text-red-400 text-sm">
              Are you sure you want to delete this event? All associated data will be permanently removed.
            </p>
          </div>

          {/* Event Info */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 space-y-3">
            <div>
              <label className="text-xs text-gray-500 uppercase">Event Title</label>
              <p className="text-white font-semibold">{event.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 uppercase flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>Match Date</span>
                </label>
                <p className="text-white text-sm">{formatDate(event.match_date)}</p>
              </div>

              <div>
                <label className="text-xs text-gray-500 uppercase flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>Teams</span>
                </label>
                <p className="text-white text-sm">{event.registered_teams}/{event.max_teams}</p>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 uppercase flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>Venue</span>
              </label>
              <p className="text-white text-sm">{event.venue}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Delete Event</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEventModal;
