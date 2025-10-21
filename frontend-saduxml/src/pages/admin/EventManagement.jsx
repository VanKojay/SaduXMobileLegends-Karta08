import { useState, useEffect, useCallback } from 'react';
import { Calendar, MapPin, Trophy, Users, Search, Plus, Eye, Edit2, Trash2, Filter } from 'lucide-react';
import { eventService } from '../../services/api';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/common/DashboardHeader';
import AddEventModal from '../../components/event/AddEventModal';
import EditEventModal from '../../components/event/EditEventModal';
import DeleteEventModal from '../../components/event/DeleteEventModal';
import EventDetailModal from '../../components/event/EventDetailModal';
import { useAuth } from '../../context/AuthContext';

const EventManagement = () => {
  const { isSuperAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await eventService.listEvents();
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Gagal memuat data events');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter events
  const filterEventsData = useCallback(() => {
    let filtered = [...events];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(event => event.status === filterStatus);
    }

    setFilteredEvents(filtered);
  }, [events, searchQuery, filterStatus]);

  useEffect(() => {
    filterEventsData();
  }, [events, searchQuery, filterStatus, filterEventsData]);

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

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
  };

  // Handle actions
  const handleView = (event) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsEditModalOpen(true);
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setIsDeleteModalOpen(true);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <DashboardHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Event Management</h1>
            <p className="text-gray-400">Manage tournament events and competitions</p>
          </div>
          {isSuperAdmin() && (
            <button
              onClick={handleAddClick}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-indigo-500/50"
            >
              <Plus className="w-5 h-5" />
              <span>Add Event</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search events by title or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="ongoing">Ongoing</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-400">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-12 text-center">
            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Events Found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first event to get started'}
            </p>
            {!searchQuery && filterStatus === 'all' && isSuperAdmin() && (
              <button
                onClick={handleAddClick}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
              >
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-900/50 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Event Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Teams</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Match Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Venue</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <Calendar className="w-8 h-8 text-indigo-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-white">{event.title}</div>
                            <div className="text-xs text-gray-400">ID: {event.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(event.status)}`}>
                          <span>{getStatusIcon(event.status)}</span>
                          <span className="uppercase">{event.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-white font-medium">
                            {event.registered_teams}/{event.max_teams}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white">{formatDate(event.match_date)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-white">{event.venue}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleView(event)}
                            className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {isSuperAdmin() && (
                            <>
                              <button
                                onClick={() => handleEdit(event)}
                                className="p-2 hover:bg-yellow-500/20 text-yellow-400 rounded-lg transition-colors"
                                title="Edit Event"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(event)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                title="Delete Event"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-700">
              {filteredEvents.map((event) => (
                <div key={event.id} className="p-4 hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white mb-1">{event.title}</h3>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(event.status)}`}>
                        <span>{getStatusIcon(event.status)}</span>
                        <span className="uppercase">{event.status}</span>
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>{event.registered_teams}/{event.max_teams} Teams</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(event.match_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-300">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => handleView(event)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg text-sm transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    {isSuperAdmin() && (
                      <>
                        <button
                          onClick={() => handleEdit(event)}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(event)}
                          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredEvents.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        )}
      </div>

      {/* Modals */}
      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchEvents}
      />

      <EditEventModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={fetchEvents}
        event={selectedEvent}
      />

      <DeleteEventModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={fetchEvents}
        event={selectedEvent}
      />

      <EventDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
      />
    </div>
  );
};

export default EventManagement;
