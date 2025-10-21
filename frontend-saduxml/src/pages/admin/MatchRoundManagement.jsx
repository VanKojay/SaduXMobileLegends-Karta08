import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, GitBranch, ChevronDown, ChevronRight } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { matchRoundService, matchService, stageService } from '../../services/api';
import toast from 'react-hot-toast';

const MatchRoundManagement = () => {
  const [rounds, setRounds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedMatches, setExpandedMatches] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingRound, setEditingRound] = useState(null);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    match_id: '',
    stage_id: '',
    round_number: 1,
    score_team1: 0,
    score_team2: 0,
    winner_id: null,
    status: 'pending',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [roundsRes, matchesRes, stagesRes] = await Promise.all([
        matchRoundService.listMatchRounds(),
        matchService.listMatches(),
        stageService.listStages(),
      ]);

      setRounds(roundsRes.data || []);
      setMatches(matchesRes.data || []);
      setStages(stagesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRounds = async () => {
    try {
      const response = await matchRoundService.listMatchRounds();
      setRounds(response.data || []);
    } catch (error) {
      console.error('Error fetching rounds:', error);
      toast.error('Gagal memuat data rounds');
    }
  };

  const toggleMatch = (matchId) => {
    const newExpanded = new Set(expandedMatches);
    if (newExpanded.has(matchId)) {
      newExpanded.delete(matchId);
    } else {
      newExpanded.add(matchId);
    }
    setExpandedMatches(newExpanded);
  };

  const getMatchRounds = (matchId) => {
    return rounds.filter((r) => r.match_id === matchId).sort((a, b) => a.round_number - b.round_number);
  };

  // Removed unused getMatchDetails function - can be added back if needed

  const getStageName = (stageId) => {
    if (!stageId) return '-';
    const stage = stages.find((s) => s.id === stageId);
    return stage ? stage.name : `Stage #${stageId}`;
  };

  const handleOpenModal = (round = null) => {
    if (round) {
      setEditingRound(round);
      setFormData({
        match_id: round.match_id || '',
        stage_id: round.stage_id || '',
        round_number: round.round_number || 1,
        score_team1: round.score_team1 || 0,
        score_team2: round.score_team2 || 0,
        winner_id: round.winner_id || null,
        status: round.status || 'pending',
      });
    } else {
      setEditingRound(null);
      setFormData({
        match_id: '',
        stage_id: '',
        round_number: 1,
        score_team1: 0,
        score_team2: 0,
        winner_id: null,
        status: 'pending',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRound(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.match_id) {
      errors.match_id = 'Match harus dipilih';
    }

    if (!formData.stage_id) {
      errors.stage_id = 'Stage harus dipilih';
    }

    if (!formData.round_number || formData.round_number < 1) {
      errors.round_number = 'Round number harus >= 1';
    }

    if (!formData.status) {
      errors.status = 'Status harus dipilih';
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

    const submitData = {
      ...formData,
      match_id: parseInt(formData.match_id),
      stage_id: parseInt(formData.stage_id),
      round_number: parseInt(formData.round_number),
      score_team1: parseInt(formData.score_team1) || 0,
      score_team2: parseInt(formData.score_team2) || 0,
      winner_id: formData.winner_id ? parseInt(formData.winner_id) : null,
    };

    try {
      if (editingRound) {
        await matchRoundService.updateMatchRound(editingRound.id, submitData);
        toast.success('Round berhasil diupdate!');
      } else {
        await matchRoundService.createMatchRound(submitData);
        toast.success('Round berhasil dibuat!');
      }

      handleCloseModal();
      fetchRounds();
    } catch (error) {
      console.error('Error saving round:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan round';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (round) => {
    setSelectedRound(round);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRound) return;

    setIsSubmitting(true);
    try {
      await matchRoundService.deleteMatchRound(selectedRound.id);
      toast.success('Round berhasil dihapus!');
      setIsDeleteModalOpen(false);
      setSelectedRound(null);
      fetchRounds();
    } catch (error) {
      console.error('Error deleting round:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menghapus round';
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

  const stats = {
    total: rounds.length,
    completed: rounds.filter((r) => r.status === 'finished').length,
    ongoing: rounds.filter((r) => r.status === 'ongoing').length,
  };

  return (
    <AdminLayout title="Match Rounds Management" subtitle="Kelola rounds untuk setiap match">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Rounds</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-sm text-gray-400">Completed</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-green-400" />
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
              <GitBranch className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold">Match Rounds</h3>
            <p className="text-sm text-gray-400 mt-1">Rounds dikelompokkan berdasarkan match</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/30 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            <span>Create Round</span>
          </button>
        </div>
      </div>

      {/* Matches & Rounds Accordion */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading rounds...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center text-gray-400">
            <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">Tidak ada match</p>
            <p className="text-sm">Buat match terlebih dahulu di Match Management</p>
          </div>
        ) : (
          matches.map((match) => {
            const matchRounds = getMatchRounds(match.id);
            const isExpanded = expandedMatches.has(match.id);

            return (
              <div
                key={match.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
              >
                {/* Match Header */}
                <button
                  onClick={() => toggleMatch(match.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-gray-400">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg">
                        Match #{match.id} - {getStageName(match.stage_id)}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {matchRounds.length} round{matchRounds.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase ${getStatusColor(match.status)}`}>
                      {match.status}
                    </span>
                  </div>
                </button>

                {/* Rounds List */}
                {isExpanded && (
                  <div className="border-t border-gray-700">
                    {matchRounds.length === 0 ? (
                      <div className="px-6 py-8 text-center text-gray-400">
                        <p className="text-sm">Belum ada round untuk match ini</p>
                        <button
                          onClick={() => {
                            setFormData({ ...formData, match_id: match.id, stage_id: match.stage_id || '' });
                            handleOpenModal();
                          }}
                          className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
                        >
                          + Tambah Round
                        </button>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-700">
                        {matchRounds.map((round) => (
                          <div
                            key={round.id}
                            className="px-6 py-4 flex items-center justify-between hover:bg-gray-700/20 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-sm font-bold text-indigo-400">R{round.round_number}</span>
                              </div>
                              <div>
                                <p className="font-medium">Round {round.round_number}</p>
                                <p className="text-sm text-gray-400">
                                  Score: {round.score_team1 || 0} - {round.score_team2 || 0}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(round.status)}`}>
                                {round.status}
                              </span>
                              <button
                                onClick={() => handleOpenModal(round)}
                                className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors"
                                title="Edit round"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(round)}
                                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                                title="Delete round"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold">{editingRound ? 'Edit Round' : 'Create Round'}</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Match Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Match *</label>
                <select
                  value={formData.match_id}
                  onChange={(e) => setFormData({ ...formData, match_id: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    formErrors.match_id ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  disabled={editingRound}
                >
                  <option value="">-- Select Match --</option>
                  {matches.map((match) => (
                    <option key={match.id} value={match.id}>
                      Match #{match.id} - {getStageName(match.stage_id)}
                    </option>
                  ))}
                </select>
                {formErrors.match_id && <p className="mt-1 text-sm text-red-400">{formErrors.match_id}</p>}
              </div>

              {/* Stage Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stage *</label>
                <select
                  value={formData.stage_id}
                  onChange={(e) => setFormData({ ...formData, stage_id: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    formErrors.stage_id ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">-- Select Stage --</option>
                  {stages.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.name}
                    </option>
                  ))}
                </select>
                {formErrors.stage_id && <p className="mt-1 text-sm text-red-400">{formErrors.stage_id}</p>}
              </div>

              {/* Round Number & Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Round Number *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.round_number}
                    onChange={(e) => setFormData({ ...formData, round_number: parseInt(e.target.value) || 1 })}
                    className={`w-full px-4 py-3 bg-gray-800 border ${
                      formErrors.round_number ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {formErrors.round_number && <p className="mt-1 text-sm text-red-400">{formErrors.round_number}</p>}
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

              {/* Scores */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/30"
              >
                {isSubmitting ? 'Saving...' : editingRound ? 'Update Round' : 'Create Round'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedRound && (
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
              <h2 className="text-2xl font-bold text-center mb-2">Delete Round?</h2>
              <p className="text-gray-400 text-center mb-6">
                Apakah Anda yakin ingin menghapus <span className="font-semibold text-white">Round {selectedRound.round_number}</span> untuk Match #{selectedRound.match_id}?
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

export default MatchRoundManagement;
