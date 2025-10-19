import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Trophy, LogOut, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { teamService } from '../../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingTeams: 0,
    approvedTeams: 0,
    activeMatches: 0,
  });
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data saat component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await teamService.listTeams();
      const allTeams = response.data;
      
      setTeams(allTeams);
      setStats({
        totalTeams: allTeams.length,
        pendingTeams: allTeams.filter(t => t.status === 'pending').length,
        approvedTeams: allTeams.filter(t => t.status === 'approved').length,
        activeMatches: 0, // Placeholder
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statCards = [
    {
      label: 'Total Teams',
      value: stats.totalTeams,
      icon: <Users className="w-8 h-8" />,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
    },
    {
      label: 'Pending Approval',
      value: stats.pendingTeams,
      icon: <Clock className="w-8 h-8" />,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400',
    },
    {
      label: 'Approved Teams',
      value: stats.approvedTeams,
      icon: <CheckCircle className="w-8 h-8" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
    },
    {
      label: 'Active Matches',
      value: stats.activeMatches,
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
    },
  ];

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
              className="w-full flex items-center space-x-3 px-4 py-3 bg-indigo-500/20 text-indigo-400 rounded-lg"
            >
              <Trophy className="w-5 h-5" />
              {isSidebarOpen && <span>Dashboard</span>}
            </button>
            <button
              onClick={() => navigate('/admin/teams')}
              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors"
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
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Selamat datang kembali, {user?.name || user?.email}
          </p>
        </div>

        {/* Stats Cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:scale-105 transition-transform"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg ${stat.textColor}`}>
                    {stat.icon}
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Recent Teams */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Teams</h2>
            <button
              onClick={() => navigate('/admin/teams')}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
            >
              View All →
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : teams.length === 0 ? (
            <p className="text-gray-400 text-center py-8">Belum ada team terdaftar</p>
          ) : (
            <div className="space-y-3">
              {teams.slice(0, 5).map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">{team.name}</h3>
                    <p className="text-sm text-gray-400">{team.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      team.status === 'approved'
                        ? 'bg-green-500/20 text-green-400'
                        : team.status === 'pending'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {team.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
