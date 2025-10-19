import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Shield, LogOut, Trophy, UserPlus, X, Phone, Gamepad2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { teamService } from '../services/api';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [teamInfo, setTeamInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [memberForm, setMemberForm] = useState({
    name: '',
    email: '',
    ml_id: '',
    phone: '',
  });
  const [memberErrors, setMemberErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchTeamInfo();
  }, []);

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
      setMemberForm({ name: '', email: '', ml_id: '', phone: '' });
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      approved: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || colors.pending;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">My Dashboard</h1>
                <p className="text-xs text-gray-400">Team Management</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/bracket')}
                className="px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-lg transition-colors text-sm font-medium"
              >
                View Bracket
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Team Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{teamInfo?.name || user?.name || 'Team Name'}</h2>
                  <p className="text-gray-400 flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{teamInfo?.email || user?.email}</span>
                  </p>
                </div>
                <div>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadge(
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
                    ⏳ Team Anda sedang menunggu approval dari admin. Anda akan mendapat notifikasi setelah di-approve.
                  </p>
                </div>
              )}
              {teamInfo?.status === 'approved' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
                  <p className="text-green-400 text-sm">
                    ✅ Selamat! Team Anda sudah disetujui dan bisa ikut turnamen.
                  </p>
                </div>
              )}
              {teamInfo?.status === 'rejected' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
                  <p className="text-red-400 text-sm">
                    ❌ Maaf, team Anda ditolak. Silakan hubungi admin untuk informasi lebih lanjut.
                  </p>
                </div>
              )}

              {/* Team Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{teamInfo?.members?.length || 0}</p>
                      <p className="text-sm text-gray-400">Total Members</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-gray-400">Matches Played</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-sm text-gray-400">Wins</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Team Members</h3>
                <button
                  onClick={() => setIsAddMemberModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Member</span>
                </button>
              </div>

              {!teamInfo?.members || teamInfo.members.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">Belum ada member di team Anda</p>
                  <button
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Tambah Member Pertama
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teamInfo.members.map((member, index) => (
                    <div
                      key={index}
                      className="bg-gray-700/30 rounded-lg p-4 hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{member.name}</h4>
                          <p className="text-sm text-gray-400 flex items-center space-x-2 mb-1">
                            <Mail className="w-3 h-3" />
                            <span>{member.email}</span>
                          </p>
                          <p className="text-sm text-gray-400 flex items-center space-x-2 mb-1">
                            <Gamepad2 className="w-3 h-3" />
                            <span>ML ID: {member.ml_id}</span>
                          </p>
                          <p className="text-sm text-gray-400 flex items-center space-x-2">
                            <Phone className="w-3 h-3" />
                            <span>{member.phone}</span>
                          </p>
                        </div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800 animate-slideUp my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-800">
              <h2 className="text-2xl font-bold">Add Team Member</h2>
              <button
                onClick={() => setIsAddMemberModalOpen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              {/* General Error */}
              {memberErrors.general && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{memberErrors.general}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nama Member</label>
                <input
                  type="text"
                  value={memberForm.name}
                  onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.name ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Nama lengkap member"
                />
                {memberErrors.name && <p className="mt-1 text-sm text-red-400">{memberErrors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.email ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="email@example.com"
                />
                {memberErrors.email && <p className="mt-1 text-sm text-red-400">{memberErrors.email}</p>}
              </div>

              {/* ML ID */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Mobile Legends ID</label>
                <input
                  type="text"
                  value={memberForm.ml_id}
                  onChange={(e) => setMemberForm({ ...memberForm, ml_id: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.ml_id ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="123456789"
                />
                {memberErrors.ml_id && <p className="mt-1 text-sm text-red-400">{memberErrors.ml_id}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nomor Telepon</label>
                <input
                  type="text"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                  className={`w-full px-4 py-3 bg-gray-800 border ${
                    memberErrors.phone ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="081234567890"
                />
                {memberErrors.phone && <p className="mt-1 text-sm text-red-400">{memberErrors.phone}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Adding...' : 'Add Member'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
