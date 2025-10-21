import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, X, Grid3x3, Users } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { groupService } from '../../services/api';
import toast from 'react-hot-toast';

const GroupManagement = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Define filterGroupsData BEFORE useEffect that uses it
  const filterGroupsData = useCallback(() => {
    let filtered = [...groups];

    // Search
    if (searchQuery) {
      filtered = filtered.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGroups(filtered);
  }, [groups, searchQuery]);

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    filterGroupsData();
  }, [groups, searchQuery, filterGroupsData]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await groupService.listGroups();
      setGroups(response.data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Gagal memuat data groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (group = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
      });
    } else {
      setEditingGroup(null);
      setFormData({
        name: '',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGroup(null);
    setFormData({ name: '' });
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'Nama group minimal 2 karakter';
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
      // Note: Update endpoint might not exist in backend yet
      // For now, only create is supported based on Postman collection
      if (editingGroup) {
        // TODO: Add update endpoint when backend supports it
        toast.warning('Update group belum didukung oleh backend');
        handleCloseModal();
        return;
      } else {
        await groupService.createGroup(formData);
        toast.success('Group berhasil dibuat!');
      }

      handleCloseModal();
      fetchGroups();
    } catch (error) {
      console.error('Error saving group:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menyimpan group';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (group) => {
    setSelectedGroup(group);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedGroup) return;

    // Note: Delete endpoint might not exist in backend yet
    toast.warning('Delete group belum didukung oleh backend');
    setIsDeleteModalOpen(false);
    setSelectedGroup(null);

    // TODO: Uncomment when backend supports delete
    /*
    setIsSubmitting(true);
    try {
      await groupService.deleteGroup(selectedGroup.id);
      toast.success(`Group "${selectedGroup.name}" berhasil dihapus!`);
      setIsDeleteModalOpen(false);
      setSelectedGroup(null);
      fetchGroups();
    } catch (error) {
      console.error('Error deleting group:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menghapus group';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
    */
  };

  return (
    <AdminLayout title="Group Management" subtitle="Kelola groups untuk tournament">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{groups.length}</p>
              <p className="text-sm text-gray-400">Total Groups</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Grid3x3 className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">0</p>
              <p className="text-sm text-gray-400">Teams Assigned</p>
            </div>
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">-</p>
              <p className="text-sm text-gray-400">Avg Teams/Group</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Create Button */}
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all font-medium shadow-lg shadow-purple-500/30 hover:scale-105 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            <span>Create Group</span>
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-400">
          Menampilkan {filteredGroups.length} dari {groups.length} groups
        </div>
      </div>

      {/* Groups Grid */}
      <div>
        {isLoading ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading groups...</p>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center text-gray-400">
            <Grid3x3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold mb-2">Tidak ada group</p>
            <p className="text-sm mb-4">Buat group untuk mengorganisir teams</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all font-medium shadow-lg shadow-purple-500/30"
            >
              <Plus className="w-5 h-5" />
              <span>Create Group</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold mb-1 truncate">{group.name}</h3>
                    <p className="text-sm text-gray-400">Group ID: #{group.id}</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                    <Grid3x3 className="w-5 h-5 text-purple-400" />
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4 text-sm text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>0 teams</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenModal(group)}
                    className="flex-1 px-3 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                    title="Edit group"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(group)}
                    className="flex-1 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium flex items-center justify-center space-x-1"
                    title="Delete group"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={handleCloseModal}
        >
          <div
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold">{editingGroup ? 'Edit Group' : 'Create Group'}</h2>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Group Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Group Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    formErrors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="e.g., Group A, Group B"
                  autoFocus
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-400">{formErrors.name}</p>}
                <p className="mt-1.5 text-xs text-gray-500">Nama group untuk mengorganisir teams</p>
              </div>

              {/* Info Note */}
              {!editingGroup && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                  <p className="text-sm text-blue-400">
                    💡 Setelah group dibuat, Anda bisa assign teams melalui Match Management.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-purple-500/30"
              >
                {isSubmitting ? 'Saving...' : editingGroup ? 'Update Group' : 'Create Group'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedGroup && (
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
              <h2 className="text-2xl font-bold text-center mb-2">Delete Group?</h2>
              <p className="text-gray-400 text-center mb-6">
                Apakah Anda yakin ingin menghapus group <span className="font-semibold text-white">"{selectedGroup.name}"</span>?
                Teams yang di-assign ke group ini akan terpengaruh.
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

export default GroupManagement;
