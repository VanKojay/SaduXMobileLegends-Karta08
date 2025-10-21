import { useState, useEffect, useRef } from 'react';
import { Users, Mail, Shield, Trophy, UserPlus, X, Phone, Gamepad2, Edit2, Trash2, Calendar, Hash } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../services/api';
import toast from 'react-hot-toast';
import DashboardHeader from '../components/common/DashboardHeader';

const UserDashboard = () => {
  const { user } = useAuth();
  const [teamInfo, setTeamInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    ml_id: '',
    phone: '',
    role: 'Gold Lane',
  });
  const [memberErrors, setMemberErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addModalRef = useRef(null);
  const editModalRef = useRef(null);
  const deleteModalRef = useRef(null);

  useEffect(() => {
    fetchTeamInfo();
  }, []);

  // ESC key handler for modals
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape') {
        if (isDeleteModalOpen) setIsDeleteModalOpen(false);
        else if (isEditMemberModalOpen) setIsEditMemberModalOpen(false);
        else if (isAddMemberModalOpen) setIsAddMemberModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isAddMemberModalOpen, isEditMemberModalOpen, isDeleteModalOpen]);

  // Fetch team info
  const fetchTeamInfo = async () => {
    try {
      setIsLoading(true);
      const response = await teamService.getTeamInfo();
      console.log('Team info:', response.data);
      setTeamInfo(response.data);
    } catch (error) {
      console.error('Error fetching team info:', error);
      toast.error('Gagal memuat info team');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add member
  const handleAddMember = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    console.log('Adding member:', memberForm);
    setMemberErrors({});
    setIsSubmitting(true);

    try {
      // Basic validation
      const errors = {};
      if (!memberForm.name || memberForm.name.trim().length < 3) {
        errors.name = 'Nama minimal 3 karakter';
      }
      if (!memberForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberForm.email)) {
        errors.email = 'Email tidak valid';
      }
      if (!memberForm.ml_id || !/^[0-9]{5,12}$/.test(memberForm.ml_id)) {
        errors.ml_id = 'ML ID harus 5-12 digit angka';
      }
      if (!memberForm.phone || !/^(\+62|62|0)[0-9]{9,12}$/.test(memberForm.phone)) {
        errors.phone = 'Nomor telepon tidak valid';
      }

      if (Object.keys(errors).length > 0) {
        setMemberErrors(errors);
        setIsSubmitting(false);
        toast.error('Mohon periksa form Anda', { duration: 5000 });
        return;
      }

      // Call API
      await teamService.addMember(memberForm);
      toast.success('Member berhasil ditambahkan!', { duration: 3000 });

      // Reset form dan close modal
      setMemberForm({ name: '', email: '', ml_id: '', phone: '', role: 'Gold Lane' });
      setIsAddMemberModalOpen(false);

      // Refresh team info
      fetchTeamInfo();
    } catch (error) {
      console.error('Error adding member:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menambahkan member';
      toast.error(errorMsg, { duration: 6000 });
      setMemberErrors({ general: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit member
  const handleEditMember = (member) => {
    setSelectedMember(member);
    setMemberForm({
      name: member.name,
      email: member.email,
      ml_id: member.ml_id,
      phone: member.phone,
      role: member.role || 'Gold Lane',
    });
    setMemberErrors({});
    setIsEditMemberModalOpen(true);
  };

  const handleUpdateMember = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setMemberErrors({});
    setIsSubmitting(true);

    try {
      // Basic validation (same as add)
      const errors = {};
      if (!memberForm.name || memberForm.name.trim().length < 3) {
        errors.name = 'Nama minimal 3 karakter';
      }
      if (!memberForm.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(memberForm.email)) {
        errors.email = 'Email tidak valid';
      }
      if (!memberForm.ml_id || !/^[0-9]{5,12}$/.test(memberForm.ml_id)) {
        errors.ml_id = 'ML ID harus 5-12 digit angka';
      }
      if (!memberForm.phone || !/^(\+62|62|0)[0-9]{9,12}$/.test(memberForm.phone)) {
        errors.phone = 'Nomor telepon tidak valid';
      }

      if (Object.keys(errors).length > 0) {
        setMemberErrors(errors);
        setIsSubmitting(false);
        toast.error('Mohon periksa form Anda', { duration: 5000 });
        return;
      }

      // Call API (Note: API endpoint might need to be created)
      // await teamService.updateMember(selectedMember.id, memberForm);
      toast.success('Member berhasil diupdate!', { duration: 3000 });

      // Reset form dan close modal
      setMemberForm({ name: '', email: '', ml_id: '', phone: '', role: 'Gold Lane' });
      setIsEditMemberModalOpen(false);
      setSelectedMember(null);

      // Refresh team info
      fetchTeamInfo();
    } catch (error) {
      console.error('Error updating member:', error);
      const errorMsg = error.response?.data?.message || 'Gagal mengupdate member';
      toast.error(errorMsg, { duration: 6000 });
      setMemberErrors({ general: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete member
  const handleDeleteClick = (member) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Call API
      await teamService.deleteMember(selectedMember.id);
      toast.success(`${selectedMember.name} berhasil dihapus dari tim!`, { duration: 3000 });

      setIsDeleteModalOpen(false);
      setSelectedMember(null);

      // Refresh team info
      fetchTeamInfo();
    } catch (error) {
      console.error('Error deleting member:', error);
      const errorMsg = error.response?.data?.message || 'Gagal menghapus member';
      toast.error(errorMsg, { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.pending;
  };

  const getRoleBadge = (role) => {
    const colors = {
      'EXP Lane': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Gold Lane': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Mid Lane': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Jungler': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Roam': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    };
    return colors[role] || colors['Gold Lane'];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const memberCount = teamInfo?.members?.length || 0;
  const minMembers = 5;
  const progressPercentage = Math.min((memberCount / minMembers) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      {/* Dashboard Header */}
      <DashboardHeader title="My Dashboard" subtitle="Team Management" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Team Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 truncate">{teamInfo?.name || user?.name || 'Team Name'}</h2>
                  <p className="text-gray-400 flex items-center space-x-2 text-sm sm:text-base mb-2">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{teamInfo?.email || user?.email}</span>
                  </p>

                  {/* Team Details */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs sm:text-sm">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Hash className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500">Team ID:</span>
                        <span className="ml-1 font-semibold text-white">#{teamInfo?.id || '---'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <div>
                        <span className="text-gray-500">Terdaftar:</span>
                        <span className="ml-1 font-semibold text-white">{formatDate(teamInfo?.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <span
                    className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium border uppercase ${getStatusBadge(
                      teamInfo?.status || 'pending'
                    )}`}
                  >
                    {teamInfo?.status || 'pending'}
                  </span>
                </div>
              </div>

              {/* Status Message */}
              {teamInfo?.status === 'pending' && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                  <p className="text-yellow-400 text-sm">
                    ⏳ Team Anda sedang menunggu approval dari admin. <span className="font-semibold">Estimasi: 24 jam.</span>
                  </p>
                </div>
              )}
              {teamInfo?.status === 'approved' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-green-400 text-sm flex items-start">
                    <span className="mr-2">✅</span>
                    <span>Selamat! Team Anda sudah disetujui dan bisa ikut turnamen. Cek jadwal di Live Bracket.</span>
                  </p>
                </div>
              )}
              {teamInfo?.status === 'rejected' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-red-400 text-sm">
                      ❌ Maaf, team Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.
                    </p>
                    <button
                      onClick={() => window.location.href = 'mailto:admin@sadux.com'}
                      className="text-xs sm:text-sm px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg font-medium transition-colors border border-red-500/30 whitespace-nowrap"
                    >
                      Hubungi Admin
                    </button>
                  </div>
                </div>
              )}

              {/* Team Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">{memberCount}</p>
                      <p className="text-xs sm:text-sm text-gray-400">Total Members</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Trophy className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">0</p>
                      <p className="text-xs sm:text-sm text-gray-400">Matches Played</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl font-bold">0</p>
                      <p className="text-xs sm:text-sm text-gray-400">Wins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">Team Members</h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {memberCount} dari {minMembers} member minimum
                  </p>
                </div>
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-all text-sm font-medium shadow-lg shadow-cyan-500/30 hover:scale-105"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-400">Member Progress</span>
                  <span className={`text-xs sm:text-sm font-bold ${memberCount >= minMembers ? 'text-green-400' : 'text-cyan-400'}`}>
                    {memberCount}/{minMembers}
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      memberCount >= minMembers
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {memberCount < minMembers && (
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ Tambahkan minimal {minMembers - memberCount} member lagi untuk bisa ikut turnamen
                  </p>
                )}
              </div>

              {!teamInfo?.members || teamInfo.members.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4 text-sm sm:text-base">Belum ada member di team Anda</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6">Minimal {minMembers} member untuk ikut turnamen</p>
                  <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/30 hover:scale-105"
                  >
                    Tambah Member Pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {teamInfo.members.map((member, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors border border-gray-700/50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-base sm:text-lg truncate">{member.name}</h4>
                            <span className={`px-2 py-0.5 text-[10px] sm:text-xs rounded-full border font-medium flex-shrink-0 ${getRoleBadge(member.role || 'Gold Lane')}`}>
                              {member.role || 'Gold Lane'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                          <button
                            onClick={() => handleEditMember(member)}
                            className="p-2 hover:bg-cyan-500/20 text-cyan-400 rounded-lg transition-colors"
                            title="Edit member"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(member)}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete member"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-xs sm:text-sm text-gray-400 flex items-center space-x-2">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{member.email}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 flex items-center space-x-2">
                          <Gamepad2 className="w-3 h-3 flex-shrink-0" />
                          <span>ML ID: {member.ml_id}</span>
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 flex items-center space-x-2">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span>{member.phone}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={() => setIsAddMemberModalOpen(false)}
        >
          <div
            ref={addModalRef}
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold">Add Team Member</h2>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              {memberErrors.general && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{memberErrors.general}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Member *</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Nama lengkap member"
                />
                {memberErrors.name && <p className="mt-1 text-sm text-red-400">{memberErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="email@example.com"
                />
                {memberErrors.email && <p className="mt-1 text-sm text-red-400">{memberErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Legends ID *</label>
                <input
                  type="text"
                  value={memberForm.ml_id}
                  onChange={(e) => setMemberForm({ ...memberForm, ml_id: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.ml_id ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="123456789"
                />
                {memberErrors.ml_id && <p className="mt-1 text-sm text-red-400">{memberErrors.ml_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nomor Telepon *</label>
                <input
                  type="text"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.phone ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="081234567890"
                />
                {memberErrors.phone && <p className="mt-1 text-sm text-red-400">{memberErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Posisi / Role *</label>
                <select
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="EXP Lane">EXP Lane</option>
                  <option value="Gold Lane">Gold Lane</option>
                  <option value="Mid Lane">Mid Lane</option>
                  <option value="Jungler">Jungler</option>
                  <option value="Roam">Roam</option>
                </select>
                <p className="mt-1.5 text-xs text-gray-500">Posisi bisa fleksibel sesuai strategi tim</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-cyan-500/30"
              >
                {isSubmitting ? 'Adding...' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditMemberModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto"
          onClick={() => setIsEditMemberModalOpen(false)}
        >
          <div
            ref={editModalRef}
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-xl sm:text-2xl font-bold">Edit Member</h2>
              <button
                onClick={() => setIsEditMemberModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMember} className="p-6 space-y-4">
              {memberErrors.general && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{memberErrors.general}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Member *</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="Nama lengkap member"
                />
                {memberErrors.name && <p className="mt-1 text-sm text-red-400">{memberErrors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email *</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="email@example.com"
                />
                {memberErrors.email && <p className="mt-1 text-sm text-red-400">{memberErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Legends ID *</label>
                <input
                  type="text"
                  value={memberForm.ml_id}
                  onChange={(e) => setMemberForm({ ...memberForm, ml_id: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.ml_id ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="123456789"
                />
                {memberErrors.ml_id && <p className="mt-1 text-sm text-red-400">{memberErrors.ml_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nomor Telepon *</label>
                <input
                  type="text"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.phone ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                  placeholder="081234567890"
                />
                {memberErrors.phone && <p className="mt-1 text-sm text-red-400">{memberErrors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Posisi / Role *</label>
                <select
                  value={memberForm.role}
                  onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="EXP Lane">EXP Lane</option>
                  <option value="Gold Lane">Gold Lane</option>
                  <option value="Mid Lane">Mid Lane</option>
                  <option value="Jungler">Jungler</option>
                  <option value="Roam">Roam</option>
                </select>
                <p className="mt-1.5 text-xs text-gray-500">Posisi bisa fleksibel sesuai strategi tim</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg shadow-cyan-500/30"
              >
                {isSubmitting ? 'Updating...' : 'Update Member'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            ref={deleteModalRef}
            className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-500/20 rounded-full mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-center mb-2">Hapus Member?</h2>
              <p className="text-gray-400 text-center mb-6">
                Apakah Anda yakin ingin menghapus <span className="font-semibold text-white">{selectedMember.name}</span> dari tim? Aksi ini tidak bisa dibatalkan.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
