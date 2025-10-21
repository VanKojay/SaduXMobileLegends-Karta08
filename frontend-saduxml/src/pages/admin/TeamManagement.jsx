import { useState, useEffect, useCallback } from 'react';
import { Users, Search, Filter, CheckCircle, XCircle, X, Eye, Edit, Trash2, Mail, User, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminService } from '../../services/api';
import toast from 'react-hot-toast';

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    filterTeams();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, searchQuery, filterStatus]);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await adminService.teams.list();
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      toast.error('Gagal memuat data teams');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTeams = useCallback(() => {
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
  }, [teams, searchQuery, filterStatus]);

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

  const handleOpenEdit = (team) => {
    setSelectedTeam(team);
    setEditFormData({ name: team.name, email: team.email });
    setIsEditModalOpen(true);
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    if (!editFormData.name || !editFormData.email) {
      toast.error('Semua field wajib diisi');
      return;
    }

    try {
      setIsSubmitting(true);
      await adminService.teams.update(selectedTeam.id, editFormData);
      toast.success('Team berhasil diupdate');
      setIsEditModalOpen(false);
      fetchTeams();
    } catch (error) {
      console.error('Error updating team:', error);
      toast.error(error.response?.data?.message || 'Gagal update team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenDelete = (team) => {
    setSelectedTeam(team);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteTeam = async () => {
    try {
      setIsSubmitting(true);
      await adminService.teams.delete(selectedTeam.id);
      toast.success('Team berhasil dihapus');
      setIsDeleteModalOpen(false);
      fetchTeams();
    } catch (error) {
      console.error('Error deleting team:', error);
      toast.error(error.response?.data?.message || 'Gagal hapus team');
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    approved: 'bg-green-500/20 text-green-400 border-green-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  };

  return (
    <AdminLayout title="Team Management" subtitle="Kelola pendaftaran team dan status approval">
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
                          <button
                            onClick={() => handleOpenEdit(team)}
                            className="p-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors"
                            title="Edit Team"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenDelete(team)}
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete Team"
                          >
                            <Trash2 className="w-4 h-4" />
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
                                className="p-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 rounded-lg transition-colors"
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

      {/* Edit Modal */}
      {isEditModalOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold">Edit Team</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeam} className="p-6 space-y-4">
              {/* Team Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Nama team"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="team@example.com"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold">Hapus Team</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center space-x-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg mb-6">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-medium">Peringatan!</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Data team yang dihapus tidak dapat dikembalikan.
                  </p>
                </div>
              </div>

              <p className="text-gray-300 mb-2">Apakah Anda yakin ingin menghapus team:</p>
              <p className="text-xl font-bold mb-6">{selectedTeam.name}</p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
                  disabled={isSubmitting}
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteTeam}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TeamManagement;
