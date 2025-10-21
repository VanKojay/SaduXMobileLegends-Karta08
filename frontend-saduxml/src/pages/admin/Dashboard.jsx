import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, Trophy, Layers, Gamepad2, Grid3x3, TrendingUp, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import GenerateBracketModal from '../../components/admin/GenerateBracketModal';
import { adminService, stageService, matchService, groupService } from '../../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalTeams: 0,
    pendingTeams: 0,
    approvedTeams: 0,
    totalStages: 0,
    totalMatches: 0,
    activeMatches: 0,
    totalGroups: 0,
  });
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerateBracketModalOpen, setIsGenerateBracketModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [teamsRes, stagesRes, matchesRes, groupsRes] = await Promise.all([
        adminService.teams.list(),
        stageService.listStages(),
        matchService.listMatches(),
        groupService.listGroups(),
      ]);

      const allTeams = teamsRes.data || [];
      const allStages = stagesRes.data || [];
      const allMatches = matchesRes.data || [];
      const allGroups = groupsRes.data || [];

      setTeams(allTeams);
      setMatches(allMatches);

      setStats({
        totalTeams: allTeams.length,
        pendingTeams: allTeams.filter(t => t.status === 'pending').length,
        approvedTeams: allTeams.filter(t => t.status === 'approved').length,
        totalStages: allStages.length,
        totalMatches: allMatches.length,
        activeMatches: allMatches.filter(m => m.status === 'ongoing').length,
        totalGroups: allGroups.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Gagal memuat data dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Teams',
      value: stats.totalTeams,
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      link: '/admin/teams',
    },
    {
      label: 'Pending Approval',
      value: stats.pendingTeams,
      icon: <Clock className="w-6 h-6" />,
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400',
      link: '/admin/teams',
    },
    {
      label: 'Approved Teams',
      value: stats.approvedTeams,
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      link: '/admin/teams',
    },
    {
      label: 'Total Stages',
      value: stats.totalStages,
      icon: <Layers className="w-6 h-6" />,
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      link: '/admin/stages',
    },
    {
      label: 'Total Matches',
      value: stats.totalMatches,
      icon: <Gamepad2 className="w-6 h-6" />,
      bgColor: 'bg-indigo-500/20',
      textColor: 'text-indigo-400',
      link: '/admin/matches',
    },
    {
      label: 'Active Matches',
      value: stats.activeMatches,
      icon: <TrendingUp className="w-6 h-6" />,
      bgColor: 'bg-cyan-500/20',
      textColor: 'text-cyan-400',
      link: '/admin/matches',
    },
    {
      label: 'Total Groups',
      value: stats.totalGroups,
      icon: <Grid3x3 className="w-6 h-6" />,
      bgColor: 'bg-pink-500/20',
      textColor: 'text-pink-400',
      link: '/admin/groups',
    },
    {
      label: 'Rejected Teams',
      value: stats.totalTeams - stats.approvedTeams - stats.pendingTeams,
      icon: <Users className="w-6 h-6" />,
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400',
      link: '/admin/teams',
    },
  ];

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <AdminLayout title="Dashboard" subtitle="Tournament Management Overview">
      {/* Stats Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-28 bg-gray-800/50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              onClick={() => navigate(stat.link)}
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:scale-105 transition-all cursor-pointer hover:border-indigo-500/50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bgColor} p-2.5 rounded-lg ${stat.textColor}`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Teams */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Teams</h2>
            <button
              onClick={() => navigate('/admin/teams')}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              View All →
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
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
                  className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{team.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{team.email}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium uppercase ml-3 flex-shrink-0 ${
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

        {/* Recent Matches */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Recent Matches</h2>
            <button
              onClick={() => navigate('/admin/matches')}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
            >
              View All →
            </button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-700/50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-8">
              <Gamepad2 className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Belum ada match</p>
              <button
                onClick={() => navigate('/admin/matches')}
                className="mt-3 text-sm text-indigo-400 hover:text-indigo-300"
              >
                Create Match →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.slice(0, 5).map((match) => (
                <div
                  key={match.id}
                  className="p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Match #{match.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${
                        match.status === 'finished'
                          ? 'bg-green-500/20 text-green-400'
                          : match.status === 'ongoing'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {match.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Score: {match.score_team1 || 0} - {match.score_team2 || 0}</span>
                    <span className="text-gray-400">{formatDate(match.match_date)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Generate Bracket Button - Featured */}
          <button
            onClick={() => setIsGenerateBracketModalOpen(true)}
            className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 hover:from-yellow-500/30 hover:to-orange-500/30 border-2 border-yellow-500/50 rounded-lg transition-all hover:scale-105 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-8 h-8 text-yellow-400 mb-2 relative z-10" fill="currentColor" />
            <span className="text-sm font-bold relative z-10">Generate Bracket</span>
            <span className="text-xs text-yellow-300/80 relative z-10">Auto Create</span>
          </button>

          <button
            onClick={() => navigate('/admin/stages')}
            className="flex flex-col items-center justify-center p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-lg transition-all hover:scale-105"
          >
            <Layers className="w-8 h-8 text-purple-400 mb-2" />
            <span className="text-sm font-medium">Manage Stages</span>
          </button>
          <button
            onClick={() => navigate('/admin/groups')}
            className="flex flex-col items-center justify-center p-4 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-lg transition-all hover:scale-105"
          >
            <Grid3x3 className="w-8 h-8 text-pink-400 mb-2" />
            <span className="text-sm font-medium">Manage Groups</span>
          </button>
          <button
            onClick={() => navigate('/admin/matches')}
            className="flex flex-col items-center justify-center p-4 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg transition-all hover:scale-105"
          >
            <Gamepad2 className="w-8 h-8 text-indigo-400 mb-2" />
            <span className="text-sm font-medium">Manage Matches</span>
          </button>
          <button
            onClick={() => navigate('/bracket')}
            className="flex flex-col items-center justify-center p-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-all hover:scale-105"
          >
            <Trophy className="w-8 h-8 text-cyan-400 mb-2" />
            <span className="text-sm font-medium">View Bracket</span>
          </button>
        </div>
      </div>

      {/* Generate Bracket Modal */}
      <GenerateBracketModal
        isOpen={isGenerateBracketModalOpen}
        onClose={() => setIsGenerateBracketModalOpen(false)}
        onSuccess={() => {
          fetchDashboardData();
          navigate('/bracket');
        }}
      />
    </AdminLayout>
  );
};

export default Dashboard;
