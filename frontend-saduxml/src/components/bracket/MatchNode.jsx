import { Trophy, Circle, Zap, Eye } from 'lucide-react';

const MatchNode = ({ match, onClick, isAdmin = false, className = '' }) => {
  const getStatusColor = () => {
    switch (match.status) {
      case 'live':
      case 'ongoing':
        return 'border-red-500/50 bg-red-500/10';
      case 'finished':
      case 'completed':
        return 'border-green-500/50 bg-green-500/10';
      case 'pending':
      case 'upcoming':
      default:
        return 'border-gray-600 bg-gray-800/50';
    }
  };

  const getStatusIcon = () => {
    switch (match.status) {
      case 'live':
      case 'ongoing':
        return <Circle className="w-3 h-3 fill-red-500 text-red-500 animate-pulse" />;
      case 'finished':
      case 'completed':
        return <Trophy className="w-3 h-3 text-green-400" />;
      case 'pending':
      case 'upcoming':
      default:
        return <Zap className="w-3 h-3 text-blue-400" />;
    }
  };

  const isTeam1Winner = match.status === 'finished' && match.winner_id === match.team1_id;
  const isTeam2Winner = match.status === 'finished' && match.winner_id === match.team2_id;

  const team1Name = match.team1?.name || match.team1_name || 'TBD';
  const team2Name = match.team2?.name || match.team2_name || 'TBD';
  const team1Score = match.score_team1 ?? match.team1?.score ?? 0;
  const team2Score = match.score_team2 ?? match.team2?.score ?? 0;

  return (
    <div
      onClick={onClick}
      className={`relative group ${className} ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`w-64 border-2 rounded-lg transition-all ${getStatusColor()} ${
          onClick ? 'hover:border-indigo-500/70 hover:shadow-lg hover:shadow-indigo-500/20' : ''
        }`}
      >
        {/* Match Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-gray-700/50">
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className="text-xs text-gray-400">
              Match #{match.id || match.matchNumber}
            </span>
          </div>
          {isAdmin && onClick && (
            <Eye className="w-3 h-3 text-gray-500 group-hover:text-indigo-400 transition-colors" />
          )}
        </div>

        {/* Team 1 */}
        <div
          className={`flex items-center justify-between px-3 py-2 ${
            isTeam1Winner
              ? 'bg-indigo-500/20 border-l-4 border-indigo-500'
              : team1Name === 'TBD'
              ? 'bg-gray-900/30'
              : ''
          }`}
        >
          <span
            className={`text-sm font-medium truncate flex-1 ${
              isTeam1Winner ? 'text-white font-bold' : 'text-gray-300'
            }`}
            title={team1Name}
          >
            {team1Name}
          </span>
          <span
            className={`text-lg font-bold ml-2 ${
              isTeam1Winner ? 'text-indigo-400' : 'text-gray-400'
            }`}
          >
            {team1Score}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50" />

        {/* Team 2 */}
        <div
          className={`flex items-center justify-between px-3 py-2 ${
            isTeam2Winner
              ? 'bg-indigo-500/20 border-l-4 border-indigo-500'
              : team2Name === 'TBD'
              ? 'bg-gray-900/30'
              : ''
          }`}
        >
          <span
            className={`text-sm font-medium truncate flex-1 ${
              isTeam2Winner ? 'text-white font-bold' : 'text-gray-300'
            }`}
            title={team2Name}
          >
            {team2Name}
          </span>
          <span
            className={`text-lg font-bold ml-2 ${
              isTeam2Winner ? 'text-indigo-400' : 'text-gray-400'
            }`}
          >
            {team2Score}
          </span>
        </div>

        {/* Live Indicator */}
        {(match.status === 'live' || match.status === 'ongoing') && (
          <div className="absolute -top-2 -right-2 px-2 py-1 bg-red-500 rounded-full text-xs font-bold text-white shadow-lg animate-pulse">
            LIVE
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchNode;
