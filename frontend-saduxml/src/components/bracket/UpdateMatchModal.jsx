import { useState, useEffect } from 'react';
import { X, Save, Trophy, Play, Check, Loader2 } from 'lucide-react';
import { matchService } from '../../services/api';
import toast from 'react-hot-toast';

const UpdateMatchModal = ({ isOpen, onClose, match, onUpdate }) => {
  const [formData, setFormData] = useState({
    score_team1: 0,
    score_team2: 0,
    status: 'pending',
    winner_id: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (match) {
      setFormData({
        score_team1: match.score_team1 || 0,
        score_team2: match.score_team2 || 0,
        status: match.status || 'pending',
        winner_id: match.winner_id || null,
      });
    }
  }, [match]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Get max wins needed based on BO format
      const bestOf = match.best_of || 1;
      const maxWins = Math.ceil(bestOf / 2);

      // Validate scores
      if (formData.status === 'finished' && formData.score_team1 === formData.score_team2) {
        toast.error('Score tidak boleh sama untuk match yang sudah selesai');
        return;
      }

      // Validate BO format winner requirement
      if (formData.status === 'finished') {
        const maxScore = Math.max(formData.score_team1, formData.score_team2);
        if (maxScore < maxWins) {
          toast.error(`Match BO${bestOf} membutuhkan minimal ${maxWins} kemenangan`);
          return;
        }
      }

      // Auto-determine winner if finished
      let finalData = { ...formData };
      if (formData.status === 'finished') {
        if (formData.score_team1 > formData.score_team2) {
          finalData.winner_id = match.team1_id;
        } else if (formData.score_team2 > formData.score_team1) {
          finalData.winner_id = match.team2_id;
        }
      } else {
        finalData.winner_id = null; // Clear winner if not finished
      }

      await matchService.updateMatch(match.id, finalData);

      toast.success('Match updated successfully!');

      // Emit socket event if socket is available
      if (window.socket) {
        window.socket.emit('match:update', {
          matchId: match.id,
          updates: finalData,
        });
      }

      onUpdate && onUpdate({ ...match, ...finalData });
      onClose();
    } catch (error) {
      console.error('Error updating match:', error);
      toast.error('Failed to update match');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }));
  };

  const incrementScore = (team, amount) => {
    const field = team === 1 ? 'score_team1' : 'score_team2';
    const bestOf = match.best_of || 1;
    const maxWins = Math.ceil(bestOf / 2);

    setFormData(prev => {
      const newValue = prev[field] + amount;
      // Clamp between 0 and maxWins
      return {
        ...prev,
        [field]: Math.max(0, Math.min(maxWins, newValue))
      };
    });
  };

  if (!isOpen || !match) return null;

  const team1Name = match.team1?.name || match.team1_name || `Team #${match.team1_id}`;
  const team2Name = match.team2?.name || match.team2_name || `Team #${match.team2_id}`;

  const bestOf = match.best_of || 1;
  const maxWins = Math.ceil(bestOf / 2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span>Update Match</span>
            </h2>
            <div className="flex items-center space-x-2 mt-1">
              <p className="text-sm text-gray-400">Match #{match.id}</p>
              {match.best_of && match.best_of > 1 && (
                <>
                  <span className="text-gray-600">•</span>
                  <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded font-bold">
                    BO{match.best_of}
                  </span>
                  <span className="text-xs text-gray-500">(First to {Math.ceil(match.best_of / 2)} wins)</span>
                </>
              )}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Match Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'pending', label: 'Pending', icon: Check, color: 'yellow' },
                { value: 'ongoing', label: 'Live', icon: Play, color: 'blue' },
                { value: 'finished', label: 'Finished', icon: Trophy, color: 'green' },
              ].map((status) => (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => handleStatusChange(status.value)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                    formData.status === status.value
                      ? `border-${status.color}-500 bg-${status.color}-500/20`
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <status.icon className={`w-5 h-5 mb-1 ${
                    formData.status === status.value ? `text-${status.color}-400` : 'text-gray-500'
                  }`} />
                  <span className={`text-xs font-medium ${
                    formData.status === status.value ? 'text-white' : 'text-gray-400'
                  }`}>
                    {status.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Scores */}
          <div className="space-y-4">
            {/* Team 1 Score */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {team1Name}
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => incrementScore(1, -1)}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg text-xl font-bold transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  max={maxWins}
                  value={formData.score_team1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, score_team1: Math.min(maxWins, Math.max(0, val)) }));
                  }}
                  className="flex-1 text-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-2xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => incrementScore(1, 1)}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg text-xl font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* VS Divider */}
            <div className="text-center text-gray-500 font-medium">VS</div>

            {/* Team 2 Score */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {team2Name}
              </label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => incrementScore(2, -1)}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg text-xl font-bold transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  min="0"
                  max={maxWins}
                  value={formData.score_team2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    setFormData(prev => ({ ...prev, score_team2: Math.min(maxWins, Math.max(0, val)) }));
                  }}
                  className="flex-1 text-center px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-2xl font-bold focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => incrementScore(2, 1)}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg text-xl font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* BO Format Helper */}
          {match.best_of && match.best_of > 1 && (
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">
                <span className="font-bold text-orange-400">BO{match.best_of}</span> Series Format
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                First team to win <span className="font-bold text-white">{Math.ceil(match.best_of / 2)}</span> game(s) wins the match
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Max score per team: {Math.ceil(match.best_of / 2)}
              </p>
            </div>
          )}

          {/* Winner Preview */}
          {formData.status === 'finished' && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Winner:</div>
              <div className="text-lg font-bold text-white">
                {formData.score_team1 > formData.score_team2
                  ? team1Name
                  : formData.score_team2 > formData.score_team1
                  ? team2Name
                  : 'Draw (Invalid)'}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMatchModal;
