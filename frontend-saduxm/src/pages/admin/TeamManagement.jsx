import { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle, XCircle, LogOut, Menu, X, Trophy, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService, adminService } from '../../services/api';
import toast from 'react-hot-toast';

const TeamManagement = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  }, [teams, searchQuery, filterStatus]);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await teamService.listTeams();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Gagal memuat data teams');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeams = () => {
    let filtered = [...teams];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (team) =>
          team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          team.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((team) => team.status === filterStatus);
    }

    setFilteredTeams(filtered);
  };

  const handleApprove = async (teamId) => {
    try {
      await adminService.approveTeam(teamId);
      toast.success('Team berhasil di-approve');
      fetchTeams();
    } catch (error) {
      console.error('Error approving team:', error);
      toast.error(error.response?.data?.message || 'Gagal approve team');
    }
  };

  const handleReject = async (teamId) => {
    if (!confirm('Apakah Anda yakin ingin reject team ini?')) return;

    try {
      await adminService.rejectTeam(teamId);
      toast.success('Team berhasil di-reject');
      fetchTeams();
    } catch (error) {
      console.error('Error rejecting team:', error);
      toast.error(error.response?.data?.message || 'Gagal reject team');
    }
  };

  const handleViewDetail = (team) => {
    setSelectedTeam(team);
    setIsDetailModalOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900/90 backdrop-blur-lg border-r border-gray-800 transition-all duration-300 fixed h-full z-30`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <span className="text-xl font-bold">Admin Panel</span>
              </div>
            )}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => navigate('/admin')}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Trophy className="w-5 h-5" />
              {isSidebarOpen && <span>Dashboard</span>}
            </button>
            <button
              onClick={() => navigate('/admin/teams')}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-indigo-500/20 text-indigo-400 rounded-lg"
            >
              <Users className="w-5 h-5" />
              {isSidebarOpen && <span>Teams</span>}
            </button>
            <button
              onClick={() => navigate('/bracket')}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Trophy className="w-5 h-5" />
              {isSidebarOpen && <span>Bracket</span>}
            </button>
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 ${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        } transition-all duration-300 p-8`}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Team Management</h1>
          <p className="text-gray-400">Kelola pendaftaran team dan status approval</p>
        </div>

        {/* Filters & Search */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari team by name atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Menampilkan {filteredTeams.length} dari {teams.length} teams
            </span>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading teams...</p>
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>Tidak ada team yang ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Team Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Registered</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredTeams.map((team) => (
                    <tr key={team.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{team.name}</td>
                      <td className="px-6 py-4 text-gray-400">{team.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            statusColors[team.status] || statusColors.pending
                          }`}
                        >
                          {team.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(team.createdAt || Date.now()).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleViewDetail(team)}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {team.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(team.id)}
                                className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(team.id)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
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
          )}
        </div>
      </main>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold">Team Details</h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-sm text-gray-400">Team Name</label>
                <p className="text-lg font-semibold">{selectedTeam.name}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-lg">{selectedTeam.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Status</label>
                <p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                      statusColors[selectedTeam.status]
                    }`}
                  >
                    {selectedTeam.status}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Registered Date</label>
                <p className="text-lg">
                  {new Date(selectedTeam.createdAt || Date.now()).toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {selectedTeam.status === 'pending' && (
              <div className="p-6 border-t border-gray-800 flex space-x-3">
                <button
                  onClick={() => {
                    handleApprove(selectedTeam.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Approve Team
                </button>
                <button
                  onClick={() => {
                    handleReject(selectedTeam.id);
                    setIsDetailModalOpen(false);
                  }}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                >
                  Reject Team
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
