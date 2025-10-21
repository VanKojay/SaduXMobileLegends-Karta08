import { useState, useEffect } from 'react';
import { Gamepad2, Search, Trophy, Calendar, MapPin, Users } from 'lucide-react';
import { matchService, adminService, stageService } from '../../services/api';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/common/DashboardHeader';
import { useAuth } from '../../context/AuthContext';

const MyMatches = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [myTeamId, setMyTeamId] = useState(null);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch all data
      const [matchesRes, teamsRes, stagesRes] = await Promise.all([
        matchService.listMatches(),
        adminService.teams.list(),
        stageService.listStages(),
      ]);

      const allMatches = matchesRes.data || [];
      const allTeams = teamsRes.data || [];
      const allStages = stagesRes.data || [];

      setMatches(allMatches);
      setTeams(allTeams);
      setStages(allStages);

      // Find current user's team ID
      const currentTeam = allTeams.find(t => t.email === user?.email);
      if (currentTeam) {
        setMyTeamId(currentTeam.id);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
      toast.error('Gagal memuat data matches');
    } finally {
      setIsLoading(false);
    }
  };

  const getTeamName = (teamId) => {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : `Team #${teamId}`;
  };

  const getStageName = (stageId) => {
    const stage = stages.find(s => s.id === stageId);
    return stage ? stage.name : 'Unknown Stage';
  };

  const getOpponentTeam = (match) => {
    if (!myTeamId) return null;

    if (match.team1_id === myTeamId) {
      return { id: match.team2_id, name: getTeamName(match.team2_id), isTeam1: false };
    }
    if (match.team2_id === myTeamId) {
      return { id: match.team1_id, name: getTeamName(match.team1_id), isTeam1: true };
    }
    return null;
  };

  const getMatchResult = (match) => {
    if (!myTeamId || match.status !== 'finished') return null;

    const isTeam1 = match.team1_id === myTeamId;
    const myScore = isTeam1 ? match.score_team1 : match.score_team2;
    const opponentScore = isTeam1 ? match.score_team2 : match.score_team1;

    if (myScore > opponentScore) return 'win';
    if (myScore < opponentScore) return 'loss';
    return 'draw';
  };

  const myMatches = matches.filter(match =>
    match.team1_id === myTeamId || match.team2_id === myTeamId
  );

  const filteredMatches = myMatches.filter(match => {
    const matchesSearch = getTeamName(match.team1_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          getTeamName(match.team2_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
                          getStageName(match.stage_id).toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === 'all' || match.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'finished':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getResultBadge = (result) => {
    switch (result) {
      case 'win':
        return <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">WIN</span>;
      case 'loss':
        return <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-bold">LOSS</span>;
      case 'draw':
        return <span className="px-3 py-1 bg-gray-500/20 text-gray-400 rounded-full text-sm font-bold">DRAW</span>;
      default:
        return null;
    }
  };

  const stats = {
    total: myMatches.length,
    upcoming: myMatches.filter(m => m.status === 'pending').length,
    ongoing: myMatches.filter(m => m.status === 'ongoing').length,
    finished: myMatches.filter(m => m.status === 'finished').length,
    wins: myMatches.filter(m => getMatchResult(m) === 'win').length,
    losses: myMatches.filter(m => getMatchResult(m) === 'loss').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            My Matches
          </h1>
          <p className="text-gray-400">Lihat jadwal pertandingan team Anda</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-400">Total Matches</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <p className="text-2xl font-bold text-yellow-400">{stats.upcoming}</p>
            <p className="text-sm text-gray-400">Upcoming</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <p className="text-2xl font-bold text-blue-400">{stats.ongoing}</p>
            <p className="text-sm text-gray-400">Ongoing</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-400">{stats.finished}</p>
            <p className="text-sm text-gray-400">Finished</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-green-700 rounded-xl p-4">
            <p className="text-2xl font-bold text-green-400">{stats.wins}</p>
            <p className="text-sm text-gray-400">Wins</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-red-700 rounded-xl p-4">
            <p className="text-2xl font-bold text-red-400">{stats.losses}</p>
            <p className="text-sm text-gray-400">Losses</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari match..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        {/* Matches List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-40 bg-gray-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : !myTeamId ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
            <Users className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Team Tidak Ditemukan</h3>
            <p className="text-gray-400">Anda belum memiliki team yang terdaftar</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
            <Gamepad2 className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Belum Ada Match</h3>
            <p className="text-gray-400">Team Anda belum dijadwalkan bertanding</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => {
              const opponent = getOpponentTeam(match);
              const result = getMatchResult(match);
              const isTeam1 = match.team1_id === myTeamId;

              return (
                <div
                  key={match.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Gamepad2 className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Match #{match.id}</p>
                        <p className="font-semibold text-indigo-400">{getStageName(match.stage_id)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {result && getResultBadge(result)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(match.status)}`}>
                        {match.status || 'pending'}
                      </span>
                    </div>
                  </div>

                  {/* Match Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Your Team */}
                    <div className="text-center md:text-right">
                      <div className="flex items-center justify-center md:justify-end space-x-2 mb-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-yellow-400 font-medium">YOUR TEAM</span>
                      </div>
                      <p className="font-bold text-lg">{getTeamName(myTeamId)}</p>
                    </div>

                    {/* Score */}
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-4">
                        <span className={`text-3xl font-bold ${isTeam1 ? 'text-white' : 'text-gray-600'}`}>
                          {match.score_team1 || 0}
                        </span>
                        <span className="text-gray-500">:</span>
                        <span className={`text-3xl font-bold ${!isTeam1 ? 'text-white' : 'text-gray-600'}`}>
                          {match.score_team2 || 0}
                        </span>
                      </div>
                    </div>

                    {/* Opponent */}
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                        <span className="text-xs text-gray-400 font-medium">OPPONENT</span>
                      </div>
                      <p className="font-bold text-lg">{opponent?.name || 'TBA'}</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-gray-700 flex flex-wrap gap-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(match.match_date)}</span>
                    </div>
                    {match.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{match.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMatches;
