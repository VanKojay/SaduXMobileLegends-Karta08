/**
 * Bracket Generator Utility
 * Generates tournament brackets with different seeding strategies
 */

/**
 * Calculate number of rounds needed for single elimination
 * @param {number} teamCount - Number of teams
 * @returns {number} Number of rounds
 */
export const calculateRounds = (teamCount) => {
  if (teamCount <= 1) return 0;
  return Math.ceil(Math.log2(teamCount));
};

/**
 * Calculate next power of 2 (for bracket size)
 * @param {number} n - Number
 * @returns {number} Next power of 2
 */
export const nextPowerOfTwo = (n) => {
  return Math.pow(2, Math.ceil(Math.log2(n)));
};

/**
 * Seed teams based on strategy
 * @param {Array} teams - Array of team objects
 * @param {string} method - 'random', 'sequential', or 'manual'
 * @returns {Array} Seeded teams
 */
export const seedTeams = (teams, method = 'sequential') => {
  const teamsCopy = [...teams];

  switch (method) {
    case 'random':
      // Fisher-Yates shuffle
      for (let i = teamsCopy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [teamsCopy[i], teamsCopy[j]] = [teamsCopy[j], teamsCopy[i]];
      }
      return teamsCopy;

    case 'sequential':
      // Keep original order (by registration time, etc.)
      return teamsCopy;

    case 'manual':
      // Already manually ordered
      return teamsCopy;

    default:
      return teamsCopy;
  }
};

/**
 * Pair teams for first round matches
 * Uses standard bracket pairing (1 vs last, 2 vs second-to-last, etc.)
 * @param {Array} seededTeams - Seeded teams array
 * @returns {Array} Array of match pairs
 */
export const pairTeams = (seededTeams) => {
  const bracketSize = nextPowerOfTwo(seededTeams.length);
  const pairs = [];

  // Create pairs using standard bracket seeding
  // 1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6 (for 8-team bracket)
  const seeds = [];
  for (let i = 0; i < bracketSize; i++) {
    seeds.push(i < seededTeams.length ? seededTeams[i] : null); // null = BYE
  }

  // Standard bracket pairing algorithm
  for (let i = 0; i < bracketSize / 2; i++) {
    const topSeed = seeds[i];
    const bottomSeed = seeds[bracketSize - 1 - i];

    pairs.push({
      team1: topSeed,
      team2: bottomSeed, // Could be null (BYE)
      matchNumber: i + 1,
    });
  }

  return pairs;
};

/**
 * Generate single elimination bracket structure
 * @param {Array} teams - Array of team objects with { id, name, ... }
 * @param {string} seeding - Seeding method ('random', 'sequential', 'manual')
 * @param {number} stageId - Stage ID for this bracket
 * @returns {Object} Bracket structure with rounds and matches
 */
export const generateSingleEliminationBracket = (teams, seeding = 'sequential', stageId) => {
  if (!teams || teams.length < 2) {
    throw new Error('At least 2 teams required for bracket generation');
  }

  // Seed teams
  const seededTeams = seedTeams(teams, seeding);

  // Calculate bracket structure
  const totalRounds = calculateRounds(seededTeams.length);
  const bracketSize = nextPowerOfTwo(seededTeams.length);

  // Generate first round pairs
  const firstRoundPairs = pairTeams(seededTeams);

  // Build bracket structure
  const rounds = [];

  // Round 1
  rounds.push({
    roundNumber: 1,
    roundName: totalRounds === 1 ? 'Final' : totalRounds === 2 ? 'Semi-Finals' : totalRounds === 3 ? 'Quarter-Finals' : `Round of ${bracketSize}`,
    matches: firstRoundPairs.map((pair, index) => ({
      matchNumber: index + 1,
      team1_id: pair.team1?.id || null,
      team2_id: pair.team2?.id || null,
      team1_name: pair.team1?.name || 'BYE',
      team2_name: pair.team2?.name || 'TBD',
      stage_id: stageId,
      status: 'pending',
      score_team1: 0,
      score_team2: 0,
      winner_id: pair.team2 === null ? pair.team1?.id : null, // Auto-win if BYE
      nextMatchNumber: Math.floor(index / 2) + 1, // Which match in next round
    })),
  });

  // Subsequent rounds (placeholders)
  for (let r = 2; r <= totalRounds; r++) {
    const matchesInRound = Math.pow(2, totalRounds - r);
    const roundName = r === totalRounds ? 'Final' :
                      r === totalRounds - 1 ? 'Semi-Finals' :
                      r === totalRounds - 2 ? 'Quarter-Finals' :
                      `Round of ${matchesInRound * 2}`;

    const roundMatches = [];
    for (let m = 0; m < matchesInRound; m++) {
      roundMatches.push({
        matchNumber: m + 1,
        team1_id: null, // TBD - winner from previous round
        team2_id: null, // TBD - winner from previous round
        team1_name: 'TBD',
        team2_name: 'TBD',
        stage_id: stageId,
        status: 'pending',
        score_team1: 0,
        score_team2: 0,
        winner_id: null,
        nextMatchNumber: r < totalRounds ? Math.floor(m / 2) + 1 : null,
      });
    }

    rounds.push({
      roundNumber: r,
      roundName,
      matches: roundMatches,
    });
  }

  return {
    stageId,
    totalRounds,
    bracketSize,
    totalTeams: teams.length,
    seeding,
    rounds,
  };
};

/**
 * Create match structure for API submission
 * @param {Array} pairs - Array of team pairs
 * @param {number} stageId - Stage ID
 * @param {number} roundNumber - Round number
 * @param {number} groupId - Group ID (optional)
 * @param {number} bestOf - Best of format (1, 3, 5, 7) - Default: 1
 * @returns {Array} Array of match objects ready for API
 */
export const createMatchStructure = (pairs, stageId, roundNumber, groupId = null, bestOf = 1) => {
  return pairs.map((pair, index) => ({
    team1_id: pair.team1?.id || null,
    team2_id: pair.team2?.id || null,
    stage_id: stageId,
    group_id: groupId,
    best_of: bestOf, // ⭐ NEW - Best of format
    match_date: new Date().toISOString(),
    status: pair.team2 === null ? 'finished' : 'pending', // Auto-finish if BYE
    score_team1: pair.team2 === null ? Math.ceil(bestOf / 2) : 0, // Winner score for BO
    score_team2: 0,
    winner_id: pair.team2 === null ? pair.team1?.id : null,
    round_number: roundNumber,
    match_order: index + 1,
  }));
};

/**
 * Get round name based on round number and total rounds
 * @param {number} roundNumber - Current round number
 * @param {number} totalRounds - Total rounds in bracket
 * @returns {string} Round name
 */
export const getRoundName = (roundNumber, totalRounds) => {
  if (roundNumber === totalRounds) return 'Final';
  if (roundNumber === totalRounds - 1) return 'Semi-Finals';
  if (roundNumber === totalRounds - 2) return 'Quarter-Finals';

  const matchesInRound = Math.pow(2, totalRounds - roundNumber);
  return `Round of ${matchesInRound * 2}`;
};

/**
 * Validate bracket configuration
 * @param {Array} teams - Teams array
 * @param {string} bracketType - Type of bracket
 * @returns {Object} Validation result { valid: boolean, error: string }
 */
export const validateBracketConfig = (teams, bracketType = 'single_elimination') => {
  if (!teams || teams.length === 0) {
    return { valid: false, error: 'No teams provided' };
  }

  if (bracketType === 'single_elimination') {
    if (teams.length < 2) {
      return { valid: false, error: 'Minimum 2 teams required for single elimination' };
    }
    if (teams.length > 128) {
      return { valid: false, error: 'Maximum 128 teams allowed' };
    }
  }

  // Check for duplicate team IDs
  const teamIds = new Set();
  for (const team of teams) {
    if (teamIds.has(team.id)) {
      return { valid: false, error: `Duplicate team ID found: ${team.id}` };
    }
    teamIds.add(team.id);
  }

  return { valid: true, error: null };
};

export default {
  calculateRounds,
  nextPowerOfTwo,
  seedTeams,
  pairTeams,
  generateSingleEliminationBracket,
  createMatchStructure,
  getRoundName,
  validateBracketConfig,
};
