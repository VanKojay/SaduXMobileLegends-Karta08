import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, X, Gamepad2, TrendingUp, Clock, CheckCircle, Eye, Calendar } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { matchService, stageService, groupService, adminService } from '../../services/api';
import toast from 'react-hot-toast';

const MatchManagement = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stages, setStages] = useState([]);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    team1_id: '',
    team2_id: '',
    stage_id: '',
    group_id: '',
    match_date: '',
    status: 'pending',
    score_team1: 0,
    score_team2: 0,
    winner_id: null,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    filterMatchesData();
  }, [filterMatchesData]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [matchesRes, teamsRes, stagesRes, groupsRes] = await Promise.all([
        matchService.listMatches(),
        adminService.teams.list(),
        stageService.listStages(),
        groupService.listGroups(),
      ]);

      setMatches(matchesRes.data || []);
      setTeams(teamsRes.data || []);
      setStages(stagesRes.data || []);
      setGroups(groupsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMatches = async () => {
    try {
      const response = await matchService.listMatches();
      setMatches(response.data || []);
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Gagal memuat data matches');
    }
  };

  const getTeamName = useCallback((teamId) => {
    if (!teamId) return 'TBD';
    const team = teams.find((t) => t.id === teamId);
    return team ? team.name : `Team #${teamId}`;
  }, [teams]);

  const filterMatchesData = useCallback(() => {
    let filtered = [...matches];

    // Search by team name
    if (searchQuery) {
      filtered = filtered.filter((match) => {
        const team1Name = getTeamName(match.team1_id).toLowerCase();
        const team2Name = getTeamName(match.team2_id).toLowerCase();
        const query = searchQuery.toLowerCase();
        return team1Name.includes(query) || team2Name.includes(query);
      });
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((match) => match.status === filterStatus);
    }

    // Filter by stage
    if (filterStage !== 'all') {
      filtered = filtered.filter((match) => match.stage_id === parseInt(filterStage));
    }

    // Sort by match_date
    filtered.sort((a, b) => new Date(b.match_date || 0) - new Date(a.match_date || 0));

    setFilteredMatches(filtered);
  }, [matches, searchQuery, filterStatus, filterStage, getTeamName]);

  const getStageName = (stageId) => {
    if (!stageId) return '-';
    const stage = stages.find((s) => s.id === stageId);
    return stage ? stage.name : `Stage #${stageId}`;
  };

  // Removed unused getGroupName function - can be added back if needed

  const handleOpenModal = (match = null) => {
    if (match) {
      setEditingMatch(match);
      setFormData({
        team1_id: match.team1_id || '',
        team2_id: match.team2_id || '',
        stage_id: match.stage_id || '',
        group_id: match.group_id || '',
        match_date: match.match_date ? new Date(match.match_date).toISOString().slice(0, 16) : '',
        status: match.status || 'pending',
        score_team1: match.score_team1 || 0,
        score_team2: match.score_team2 || 0,
        winner_id: match.winner_id || null,
      });
    } else {
      setEditingMatch(null);
      setFormData({
        team1_id: '',
        team2_id: '',
        stage_id: '',
        group_id: '',
        match_date: '',
        status: 'pending',
        score_team1: 0,
        score_team2: 0,
        winner_id: null,
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMatch(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.team1_id) {
      errors.team1_id = 'Team 1 harus dipilih';
    }

    if (!formData.match_date) {
      errors.match_date = 'Match date harus diisi';
    }

    if (!formData.status) {
      errors.status = 'Status harus dipilih';
    }

    if (formData.team1_id && formData.team2_id && formData.team1_id === formData.team2_id) {
      errors.team2_id = 'Team 1 dan Team 2 tidak boleh sama';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Mohon periksa form Anda');
      return;
    }

    setIsSubmitting(true);

    // Prepare data
    const submitData = {
      ...formData,
      team1_id: parseInt(formData.team1_id),
      team2_id: formData.team2_id ? parseInt(formData.team2_id) : null,
      stage_id: formData.stage_id ? parseInt(formData.stage_id) : null,
      group_id: formData.group_id ? parseInt(formData.group_id) : null,
      score_team1: parseInt(formData.score_team1) || 0,
      score_team2: parseInt(formData.score_team2) || 0,
      winner_id: formData.winner_id ? parseInt(formData.winner_id) : null,
    };

    try {
      if (editingMatch) {
        await matchService.updateMatch(editingMatch.id, submitData);
        toast.success('Match berhasil diupdate!');
      } else {
        await matchService.createMatch(submitData);
        toast.success('Match berhasil dibuat!');
      }

      handleCloseModal();
      fetchMatches();
    } catch (error) {
      console.error('Error saving match:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan match';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (match) => {
    setSelectedMatch(match);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMatch) return;

    setIsSubmitting(true);
    try {
      await matchService.deleteMatch(selectedMatch.id);
      toast.success('Match berhasil dihapus!');
      setIsDeleteModalOpen(false);
      setSelectedMatch(null);
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menghapus match';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      ongoing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      finished: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[status] || colors.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: matches.length,
    pending: matches.filter((m) => m.status === 'pending').length,
    ongoing: matches.filter((m) => m.status === 'ongoing').length,
    finished: matches.filter((m) => m.status === 'finished').length,
  };

  return (
    <AdminLayout title="Match Management" subtitle="Kelola pertandingan turnamen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Matches</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-sm text-gray-400">Pending</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.ongoing}</p>
              <p className="text-sm text-gray-400">Ongoing</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.finished}</p>
              <p className="text-sm text-gray-400">Finished</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="ongoing">Ongoing</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="all">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.id} value={stage.id}>
                  {stage.name}
                </option>
              ))}
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/30 hover:scale-105 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Create Match</span>
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Menampilkan {filteredMatches.length} dari {matches.length} matches
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading matches...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Gamepad2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">Tidak ada match</p>
            <p className="text-sm">Buat match untuk memulai pertandingan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Match</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stage</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredMatches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="font-medium">{getTeamName(match.team1_id)}</div>
                        <div className="text-sm text-gray-500">vs</div>
                        <div className="font-medium">{getTeamName(match.team2_id)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{match.score_team1 || 0}</div>
                        <div className="text-xs text-gray-500">-</div>
                        <div className="text-lg font-bold">{match.score_team2 || 0}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">{getStageName(match.stage_id)}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{formatDate(match.match_date)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase ${getStatusColor(match.status)}`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(match)}
                          className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors"
                          title="Edit match"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(match)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete match"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-800 animate-slideUp my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold">{editingMatch ? 'Edit Match' : 'Create Match'}</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Team Selections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team 1 *</label>
                  <select
                    value={formData.team1_id}
                    onChange={(e) => setFormData({ ...formData, team1_id: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      formErrors.team1_id ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">-- Select Team 1 --</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.team1_id && <p className="mt-1 text-sm text-red-400">{formErrors.team1_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team 2</label>
                  <select
                    value={formData.team2_id}
                    onChange={(e) => setFormData({ ...formData, team2_id: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      formErrors.team2_id ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">-- Select Team 2 (TBD) --</option>
                    {teams.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.team2_id && <p className="mt-1 text-sm text-red-400">{formErrors.team2_id}</p>}
                  <p className="mt-1.5 text-xs text-gray-500">Opsional jika Team 2 belum ditentukan</p>
                </div>
              </div>

              {/* Stage & Group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Stage</label>
                  <select
                    value={formData.stage_id}
                    onChange={(e) => setFormData({ ...formData, stage_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Select Stage --</option>
                    {stages.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Group</label>
                  <select
                    value={formData.group_id}
                    onChange={(e) => setFormData({ ...formData, group_id: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">-- Select Group (Optional) --</option>
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Match Date & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Match Date *</label>
                  <input
                    type="datetime-local"
                    value={formData.match_date}
                    onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      formErrors.match_date ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {formErrors.match_date && <p className="mt-1 text-sm text-red-400">{formErrors.match_date}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="finished">Finished</option>
                  </select>
                </div>
              </div>

              {/* Scores (for editing) */}
              {editingMatch && (
                <>
                  <div className="border-t border-gray-700 pt-4">
                    <h3 className="text-lg font-semibold mb-3">Match Result</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Score Team 1</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.score_team1}
                          onChange={(e) => setFormData({ ...formData, score_team1: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Score Team 2</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.score_team2}
                          onChange={(e) => setFormData({ ...formData, score_team2: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Winner</label>
                    <select
                      value={formData.winner_id || ''}
                      onChange={(e) => setFormData({ ...formData, winner_id: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">-- No Winner Yet --</option>
                      {formData.team1_id && (
                        <option value={formData.team1_id}>{getTeamName(parseInt(formData.team1_id))}</option>
                      )}
                      {formData.team2_id && (
                        <option value={formData.team2_id}>{getTeamName(parseInt(formData.team2_id))}</option>
                      )}
                    </select>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/30"
              >
                {isSubmitting ? 'Saving...' : editingMatch ? 'Update Match' : 'Create Match'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedMatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">Delete Match?</h2>
              <p className="text-gray-400 text-center mb-6">
                Apakah Anda yakin ingin menghapus match{' '}
                <span className="font-semibold text-white">
                  {getTeamName(selectedMatch.team1_id)} vs {getTeamName(selectedMatch.team2_id)}
                </span>
                ? Semua rounds yang terkait akan terpengaruh. Aksi ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default MatchManagement;
