import { X, Trophy, Calendar, Clock, Users, Award, Gamepad2 } from 'lucide-react';

const MatchDetailModal = ({ isOpen, onClose, match }) => {
  if (!isOpen || !match) return null;

  const team1Name = match.team1?.name || match.team1_name || `Team #${match.team1_id}`;
  const team2Name = match.team2?.name || match.team2_name || `Team #${match.team2_id}`;
  const team1Score = match.score_team1 || 0;
  const team2Score = match.score_team2 || 0;

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = () => {
    const statusConfig = {
      live: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'LIVE NOW' },
      ongoing: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', label: 'LIVE' },
      finished: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Finished' },
      completed: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', label: 'Completed' },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', label: 'Upcoming' },
    };

    const config = statusConfig[match.status] || statusConfig.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    );
  };

  const isTeam1Winner = match.winner_id === match.team1_id;
  const isTeam2Winner = match.winner_id === match.team2_id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Match Details</h2>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm text-gray-400">Match #{match.id}</p>
                {match.best_of && match.best_of > 1 && (
                  <>
                    <span className="text-gray-600">•</span>
                    <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded font-bold">
                      BO{match.best_of}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status & Date */}
          <div className="flex items-center justify-between">
            {getStatusBadge()}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(match.match_date)}</span>
              {match.match_date && (
                <>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{formatTime(match.match_date)}</span>
                </>
              )}
            </div>
          </div>

          {/* Teams & Scores */}
          <div className="space-y-3">
            {/* Team 1 */}
            <div
              className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                isTeam1Winner
                  ? 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                {isTeam1Winner && (
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  </div>
                )}
                <div className="flex-1">
                  <div className={`text-lg font-bold ${isTeam1Winner ? 'text-white' : 'text-gray-300'}`}>
                    {team1Name}
                  </div>
                  {isTeam1Winner && (
                    <div className="text-xs text-yellow-400 font-medium mt-1">Winner</div>
                  )}
                </div>
              </div>
              <div className={`text-4xl font-black ${isTeam1Winner ? 'text-indigo-400' : 'text-gray-500'}`}>
                {team1Score}
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center">
              <div className="px-4 py-1 bg-gray-800 rounded-full border border-gray-700">
                <span className="text-sm font-bold text-gray-400">VS</span>
              </div>
            </div>

            {/* Team 2 */}
            <div
              className={`flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                isTeam2Winner
                  ? 'bg-indigo-500/20 border-indigo-500 shadow-lg shadow-indigo-500/20'
                  : 'bg-gray-800/50 border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-4 flex-1">
                {isTeam2Winner && (
                  <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-yellow-400" fill="currentColor" />
                  </div>
                )}
                <div className="flex-1">
                  <div className={`text-lg font-bold ${isTeam2Winner ? 'text-white' : 'text-gray-300'}`}>
                    {team2Name}
                  </div>
                  {isTeam2Winner && (
                    <div className="text-xs text-yellow-400 font-medium mt-1">Winner</div>
                  )}
                </div>
              </div>
              <div className={`text-4xl font-black ${isTeam2Winner ? 'text-indigo-400' : 'text-gray-500'}`}>
                {team2Score}
              </div>
            </div>
          </div>

          {/* BO Format Info (if applicable) */}
          {match.best_of && match.best_of > 1 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Gamepad2 className="w-5 h-5 text-orange-400" />
                <span className="text-sm font-bold text-orange-400">Series Format</span>
              </div>
              <div className="text-white font-semibold mb-1">
                Best of {match.best_of} (BO{match.best_of})
              </div>
              <div className="text-sm text-gray-400">
                First team to win <span className="font-bold text-white">{Math.ceil(match.best_of / 2)}</span> game(s) wins the match
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-400 mb-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Stage</span>
              </div>
              <div className="text-white font-semibold">
                {match.stage?.name || match.stageName || 'Unknown Stage'}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-gray-400 mb-2">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">Round</span>
              </div>
              <div className="text-white font-semibold">
                {match.round_number ? `Round ${match.round_number}` : 'N/A'}
              </div>
            </div>
          </div>

          {/* Live Indicator */}
          {(match.status === 'live' || match.status === 'ongoing') && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <div>
                <div className="text-red-400 font-bold text-sm">Match is LIVE</div>
                <div className="text-red-400/70 text-xs mt-1">Scores updating in real-time</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal;
