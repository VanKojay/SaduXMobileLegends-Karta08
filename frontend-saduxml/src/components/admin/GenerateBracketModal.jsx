import { useState, useEffect } from 'react';
import { X, Trophy, Users, Shuffle, List, ArrowRight, ArrowLeft, CheckCircle, Loader2, Gamepad2 } from 'lucide-react';
import { adminService, stageService, matchService } from '../../services/api';
import { generateSingleEliminationBracket, validateBracketConfig, createMatchStructure } from '../../utils/bracketGenerator';
import toast from 'react-hot-toast';

const GenerateBracketModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Select Stage & Teams, 2: Configure, 3: Preview
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Step 1: Data
  const [stages, setStages] = useState([]);
  const [teams, setTeams] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedTeams, setSelectedTeams] = useState([]);

  // Step 2: Configuration
  const [bracketType, setBracketType] = useState('single_elimination');
  const [seedingMethod, setSeedingMethod] = useState('sequential');
  const [bestOf, setBestOf] = useState(3); // Best of 3 as default

  // Step 3: Preview
  const [bracketPreview, setBracketPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [stagesRes, teamsRes] = await Promise.all([
        stageService.listStages(),
        adminService.teams.list(),
      ]);

      setStages(stagesRes.data || []);
      const approvedTeams = (teamsRes.data || []).filter(t => t.status === 'approved');
      setTeams(approvedTeams);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStageChange = (stageId) => {
    setSelectedStage(stageId);
    // Auto-select all approved teams by default
    setSelectedTeams(teams.map(t => t.id));
  };

  const toggleTeamSelection = (teamId) => {
    setSelectedTeams(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleNextStep = () => {
    if (step === 1) {
      // Validate step 1
      if (!selectedStage) {
        toast.error('Pilih stage terlebih dahulu');
        return;
      }
      if (selectedTeams.length < 2) {
        toast.error('Minimal 2 tim diperlukan');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate step 2 & generate preview
      generatePreview();
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const generatePreview = () => {
    const teamsForBracket = teams.filter(t => selectedTeams.includes(t.id));
    const validation = validateBracketConfig(teamsForBracket, bracketType);

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      const bracket = generateSingleEliminationBracket(
        teamsForBracket,
        seedingMethod,
        parseInt(selectedStage)
      );
      setBracketPreview(bracket);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error(error.message);
    }
  };

  const handleGenerate = async () => {
    if (!bracketPreview) return;

    try {
      setIsGenerating(true);

      // Create all matches from bracket structure
      const allMatches = [];
      for (const round of bracketPreview.rounds) {
        const roundMatches = createMatchStructure(
          round.matches.map(m => ({
            team1: { id: m.team1_id, name: m.team1_name },
            team2: m.team2_id ? { id: m.team2_id, name: m.team2_name } : null,
          })),
          parseInt(selectedStage),
          round.roundNumber,
          null, // groupId
          bestOf // Pass bestOf parameter
        );
        allMatches.push(...roundMatches);
      }

      // Submit matches to backend
      const promises = allMatches.map(match => matchService.createMatch(match));
      await Promise.all(promises);

      toast.success(`Bracket berhasil di-generate! ${allMatches.length} matches created.`);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error generating bracket:', error);
      toast.error('Gagal generate bracket');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedStage('');
    setSelectedTeams([]);
    setBracketType('single_elimination');
    setSeedingMethod('sequential');
    setBestOf(3); // Reset to BO3 default
    setBracketPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-800 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <div>
            <h2 className="text-2xl font-bold flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <span>Generate Tournament Bracket</span>
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Step {step} of 3: {step === 1 ? 'Select Stage & Teams' : step === 2 ? 'Configure Bracket' : 'Preview & Confirm'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`h-2 flex-1 rounded-full ${s <= step ? 'bg-indigo-500' : 'bg-gray-700'}`} />
                {s < 3 && <div className="w-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
              <p className="text-gray-400">Loading data...</p>
            </div>
          ) : (
            <>
              {/* Step 1: Select Stage & Teams */}
              {step === 1 && (
                <div className="space-y-6">
                  {/* Stage Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select Tournament Stage
                    </label>
                    <select
                      value={selectedStage}
                      onChange={(e) => handleStageChange(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">-- Select Stage --</option>
                      {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                          {stage.name} ({stage.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Team Selection */}
                  {selectedStage && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-300">
                          Select Teams ({selectedTeams.length} selected)
                        </label>
                        <button
                          onClick={() => setSelectedTeams(teams.map(t => t.id))}
                          className="text-xs text-indigo-400 hover:text-indigo-300"
                        >
                          Select All
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto p-2 bg-gray-800/30 rounded-lg">
                        {teams.length === 0 ? (
                          <p className="text-gray-500 text-sm col-span-2 text-center py-8">
                            No approved teams available
                          </p>
                        ) : (
                          teams.map((team) => (
                            <label
                              key={team.id}
                              className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedTeams.includes(team.id)
                                  ? 'bg-indigo-500/20 border-indigo-500/50'
                                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={selectedTeams.includes(team.id)}
                                onChange={() => toggleTeamSelection(team.id)}
                                className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-white">{team.name}</div>
                                <div className="text-xs text-gray-400">{team.email}</div>
                              </div>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Configure Bracket */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Bracket Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Bracket Type
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <label className={`flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all ${
                        bracketType === 'single_elimination'
                          ? 'bg-indigo-500/20 border-indigo-500/50'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}>
                        <input
                          type="radio"
                          name="bracketType"
                          value="single_elimination"
                          checked={bracketType === 'single_elimination'}
                          onChange={(e) => setBracketType(e.target.value)}
                          className="mt-1 w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600"
                        />
                        <div>
                          <div className="font-medium text-white">Single Elimination</div>
                          <div className="text-sm text-gray-400">
                            Standard tournament format. One loss = elimination. Fastest format.
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Seeding Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Seeding Method
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { value: 'sequential', icon: List, label: 'Sequential', desc: 'Order by registration' },
                        { value: 'random', icon: Shuffle, label: 'Random', desc: 'Randomize seeding' },
                      ].map((method) => (
                        <label
                          key={method.value}
                          className={`flex flex-col items-center space-y-2 p-4 rounded-lg border cursor-pointer transition-all ${
                            seedingMethod === method.value
                              ? 'bg-indigo-500/20 border-indigo-500/50'
                              : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="seedingMethod"
                            value={method.value}
                            checked={seedingMethod === method.value}
                            onChange={(e) => setSeedingMethod(e.target.value)}
                            className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600"
                          />
                          <method.icon className="w-8 h-8 text-gray-400" />
                          <div className="text-center">
                            <div className="font-medium text-white text-sm">{method.label}</div>
                            <div className="text-xs text-gray-400">{method.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Match Format (Best Of) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Match Format (Best Of)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: 1, label: 'BO1', desc: 'Single Game', wins: 1 },
                        { value: 3, label: 'BO3', desc: 'First to 2 wins', wins: 2 },
                        { value: 5, label: 'BO5', desc: 'First to 3 wins', wins: 3 },
                        { value: 7, label: 'BO7', desc: 'First to 4 wins', wins: 4 },
                      ].map((format) => (
                        <label
                          key={format.value}
                          className={`flex flex-col items-center space-y-2 p-4 rounded-lg border cursor-pointer transition-all ${
                            bestOf === format.value
                              ? 'bg-orange-500/20 border-orange-500/50 ring-2 ring-orange-500/30'
                              : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="bestOf"
                            value={format.value}
                            checked={bestOf === format.value}
                            onChange={(e) => setBestOf(parseInt(e.target.value))}
                            className="w-4 h-4 text-orange-600 bg-gray-700 border-gray-600"
                          />
                          <Gamepad2 className={`w-8 h-8 ${bestOf === format.value ? 'text-orange-400' : 'text-gray-400'}`} />
                          <div className="text-center">
                            <div className={`font-bold text-lg ${bestOf === format.value ? 'text-orange-400' : 'text-white'}`}>
                              {format.label}
                            </div>
                            <div className="text-xs text-gray-400">{format.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      💡 BO3 is recommended for tournament matches
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-indigo-400" />
                      <span className="font-medium text-white">Bracket Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-400">Teams:</span>
                        <span className="ml-2 text-white font-medium">{selectedTeams.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Type:</span>
                        <span className="ml-2 text-white font-medium">Single Elim</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Format:</span>
                        <span className="ml-2 text-orange-400 font-bold">BO{bestOf}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Seeding:</span>
                        <span className="ml-2 text-white font-medium capitalize">{seedingMethod}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400">Rounds:</span>
                        <span className="ml-2 text-white font-medium">{Math.ceil(Math.log2(selectedTeams.length))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Preview */}
              {step === 3 && bracketPreview && (
                <div className="space-y-4">
                  <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-white">Bracket Ready to Generate</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {bracketPreview.totalRounds} rounds, {bracketPreview.rounds.reduce((sum, r) => sum + r.matches.length, 0)} total matches
                      </div>
                    </div>
                  </div>

                  {/* Preview by rounds */}
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {bracketPreview.rounds.map((round) => (
                      <div key={round.roundNumber} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="font-semibold text-white mb-3">
                          Round {round.roundNumber}: {round.roundName}
                        </h4>
                        <div className="space-y-2">
                          {round.matches.map((match) => (
                            <div key={match.matchNumber} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg text-sm">
                              <span className="text-gray-400">Match {match.matchNumber}:</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium">{match.team1_name || 'TBD'}</span>
                                <span className="text-gray-500">vs</span>
                                <span className="text-white font-medium">{match.team2_name || 'TBD'}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800">
          <button
            onClick={step === 1 ? handleClose : handlePrevStep}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          {step < 3 ? (
            <button
              onClick={handleNextStep}
              disabled={step === 1 && (!selectedStage || selectedTeams.length < 2)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Trophy className="w-4 h-4" />
                  <span>Generate Bracket</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateBracketModal;
