import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, X, Layers, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { stageService } from '../../services/api';
import toast from 'react-hot-toast';

const StageManagement = () => {
  const [stages, setStages] = useState([]);
  const [filteredStages, setFilteredStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState(null);
  const [selectedStage, setSelectedStage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    type: 'group_stage',
    order_number: 1,
    status: 'upcoming',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchStages();
  }, []);

  useEffect(() => {
    filterStagesData();
  }, [filterStagesData]);

  const fetchStages = async () => {
    try {
      setIsLoading(true);
      const response = await stageService.listStages();
      setStages(response.data || []);
    } catch (error) {
      console.error('Error fetching stages:', error);
      toast.error('Gagal memuat data stages');
    } finally {
      setIsLoading(false);
    }
  };

  const filterStagesData = useCallback(() => {
    let filtered = [...stages];

    // Search
    if (searchQuery) {
      filtered = filtered.filter((stage) =>
        stage.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((stage) => stage.status === filterStatus);
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter((stage) => stage.type === filterType);
    }

    // Sort by order_number
    filtered.sort((a, b) => (a.order_number || 0) - (b.order_number || 0));

    setFilteredStages(filtered);
  }, [stages, searchQuery, filterStatus, filterType]);

  const handleOpenModal = (stage = null) => {
    if (stage) {
      setEditingStage(stage);
      setFormData({
        name: stage.name,
        type: stage.type,
        order_number: stage.order_number || 1,
        status: stage.status,
      });
    } else {
      setEditingStage(null);
      setFormData({
        name: '',
        type: 'group_stage',
        order_number: stages.length + 1,
        status: 'upcoming',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStage(null);
    setFormData({ name: '', type: 'group_stage', order_number: 1, status: 'upcoming' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      errors.name = 'Nama stage minimal 3 karakter';
    }

    if (!formData.type) {
      errors.type = 'Type stage harus dipilih';
    }

    if (!formData.order_number || formData.order_number < 1) {
      errors.order_number = 'Order number harus >= 1';
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

    try {
      if (editingStage) {
        await stageService.updateStage(editingStage.id, formData);
        toast.success('Stage berhasil diupdate!');
      } else {
        await stageService.createStage(formData);
        toast.success('Stage berhasil dibuat!');
      }

      handleCloseModal();
      fetchStages();
    } catch (error) {
      console.error('Error saving stage:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan stage';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (stage) => {
    setSelectedStage(stage);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStage) return;

    setIsSubmitting(true);
    try {
      await stageService.deleteStage(selectedStage.id);
      toast.success(`Stage "${selectedStage.name}" berhasil dihapus!`);
      setIsDeleteModalOpen(false);
      setSelectedStage(null);
      fetchStages();
    } catch (error) {
      console.error('Error deleting stage:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menghapus stage';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      ongoing: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      finished: 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return colors[status] || colors.upcoming;
  };

  const getTypeColor = (type) => {
    const colors = {
      group_stage: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      knockout: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      final: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[type] || colors.group_stage;
  };

  const getTypeLabel = (type) => {
    const labels = {
      group_stage: 'Group Stage',
      knockout: 'Knockout',
      final: 'Final',
    };
    return labels[type] || type;
  };

  const stats = {
    total: stages.length,
    upcoming: stages.filter((s) => s.status === 'upcoming').length,
    ongoing: stages.filter((s) => s.status === 'ongoing').length,
    finished: stages.filter((s) => s.status === 'finished').length,
  };

  return (
    <AdminLayout title="Stage Management" subtitle="Kelola stage dan fase turnamen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-gray-400">Total Stages</p>
            </div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Layers className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.upcoming}</p>
              <p className="text-sm text-gray-400">Upcoming</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{stats.ongoing}</p>
              <p className="text-sm text-gray-400">Ongoing</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-400" />
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
              placeholder="Cari stage..."
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
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="finished">Finished</option>
              </select>
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="group_stage">Group Stage</option>
              <option value="knockout">Knockout</option>
              <option value="final">Final</option>
            </select>
          </div>

          {/* Create Button */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-all font-medium shadow-lg shadow-indigo-500/30 hover:scale-105 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Create Stage</span>
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Menampilkan {filteredStages.length} dari {stages.length} stages
        </div>
      </div>

      {/* Stages Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading stages...</p>
          </div>
        ) : filteredStages.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <Layers className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">Tidak ada stage</p>
            <p className="text-sm">Buat stage pertama untuk memulai turnamen</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Stage Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredStages.map((stage) => (
                  <tr key={stage.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-700 rounded-full text-sm font-bold">
                        {stage.order_number}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{stage.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(stage.type)}`}>
                        {getTypeLabel(stage.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border uppercase ${getStatusColor(stage.status)}`}>
                        {stage.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleOpenModal(stage)}
                          className="p-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors"
                          title="Edit stage"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(stage)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete stage"
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
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold">{editingStage ? 'Edit Stage' : 'Create Stage'}</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Stage Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stage Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="e.g., Group Stage, Semi Final"
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>}
              </div>

              {/* Stage Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Stage Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    formErrors.type ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="group_stage">Group Stage</option>
                  <option value="knockout">Knockout</option>
                  <option value="final">Final</option>
                </select>
                {formErrors.type && <p className="mt-1 text-sm text-red-400">{formErrors.type}</p>}
              </div>

              {/* Order Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Order Number *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.order_number}
                  onChange={(e) => setFormData({ ...formData, order_number: parseInt(e.target.value) || 1 })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    formErrors.order_number ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="1"
                />
                {formErrors.order_number && <p className="mt-1 text-sm text-red-400">{formErrors.order_number}</p>}
                <p className="mt-1.5 text-xs text-gray-500">Urutan stage dalam turnamen</p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    formErrors.status ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="finished">Finished</option>
                </select>
                {formErrors.status && <p className="mt-1 text-sm text-red-400">{formErrors.status}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-indigo-500/30"
              >
                {isSubmitting ? 'Saving...' : editingStage ? 'Update Stage' : 'Create Stage'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedStage && (
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
              <h2 className="text-2xl font-bold text-center mb-2">Delete Stage?</h2>
              <p className="text-gray-400 text-center mb-6">
                Apakah Anda yakin ingin menghapus stage <span className="font-semibold text-white">"{selectedStage.name}"</span>?
                Semua matches yang terkait akan terpengaruh. Aksi ini tidak bisa dibatalkan.
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

export default StageManagement;
