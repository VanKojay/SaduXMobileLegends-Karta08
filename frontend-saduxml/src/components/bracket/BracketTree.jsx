import { useMemo } from 'react';
import MatchNode from './MatchNode';
import { RoundConnector } from './BracketConnector';

/**
 * BracketTree Component
 * Displays tournament bracket in tree structure with connecting lines
 * Similar to Challonge.com visualization
 */
const BracketTree = ({
  matches = [],
  onMatchClick = null,
  isAdmin = false,
  className = ''
}) => {
  // Constants for layout
  const MATCH_HEIGHT = 120;
  const MATCH_WIDTH = 256;
  const ROUND_GAP = 120;
  const VERTICAL_GAP = 40;

  // Group matches by round
  const rounds = useMemo(() => {
    const grouped = {};

    matches.forEach(match => {
      const round = match.round_number || match.roundNumber || 1;
      if (!grouped[round]) {
        grouped[round] = [];
      }
      grouped[round].push(match);
    });

    // Convert to array and sort
    return Object.entries(grouped)
      .map(([roundNumber, roundMatches]) => ({
        roundNumber: parseInt(roundNumber),
        matches: roundMatches.sort((a, b) => (a.match_order || a.id) - (b.match_order || b.id))
      }))
      .sort((a, b) => a.roundNumber - b.roundNumber);
  }, [matches]);

  // Calculate SVG dimensions
  const svgWidth = rounds.length * (MATCH_WIDTH + ROUND_GAP) + 100;
  const maxMatchesInRound = Math.max(...rounds.map(r => r.matches.length), 1);
  const svgHeight = maxMatchesInRound * (MATCH_HEIGHT + VERTICAL_GAP) + 100;

  // Get round name
  const getRoundName = (roundNumber, totalRounds) => {
    if (roundNumber === totalRounds) return 'Final';
    if (roundNumber === totalRounds - 1) return 'Semi-Finals';
    if (roundNumber === totalRounds - 2) return 'Quarter-Finals';

    const matchesInRound = Math.pow(2, totalRounds - roundNumber);
    return `Round of ${matchesInRound * 2}`;
  };

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-gray-500 mb-2">No matches in bracket</div>
        <div className="text-sm text-gray-600">Generate a bracket to see the tree view</div>
      </div>
    );
  }

  return (
    <div className={`bracket-tree-container ${className}`}>
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto overflow-y-hidden pb-4">
        <div className="relative inline-block min-w-full">
          {/* SVG for connectors */}
          <svg
            className="absolute top-0 left-0 pointer-events-none"
            width={svgWidth}
            height={svgHeight}
            style={{ zIndex: 0 }}
          >
            {/* Draw connectors between rounds */}
            {rounds.map((round, roundIndex) => {
              if (roundIndex === rounds.length - 1) return null; // No connectors from final

              const nextRound = rounds[roundIndex + 1];
              return (
                <RoundConnector
                  key={`round-connector-${roundIndex}`}
                  matches={round.matches}
                  nextRoundMatches={nextRound?.matches}
                  roundIndex={roundIndex}
                  matchHeight={MATCH_HEIGHT}
                  matchWidth={MATCH_WIDTH}
                  roundGap={ROUND_GAP}
                  verticalGap={VERTICAL_GAP}
                />
              );
            })}
          </svg>

          {/* Matches positioned absolutely */}
          <div className="relative" style={{ width: svgWidth, height: svgHeight }}>
            {rounds.map((round, roundIndex) => {
              // Calculate vertical spacing multiplier (increases each round)
              const spacingMultiplier = Math.pow(2, roundIndex);
              const roundName = getRoundName(round.roundNumber, rounds.length);

              return (
                <div
                  key={`round-${round.roundNumber}`}
                  className="absolute"
                  style={{
                    left: roundIndex * (MATCH_WIDTH + ROUND_GAP) + 50,
                    top: 0,
                    width: MATCH_WIDTH
                  }}
                >
                  {/* Round Header */}
                  <div className="mb-6 text-center sticky top-0 bg-gray-900/95 backdrop-blur-sm z-20 py-3 rounded-lg border border-gray-800">
                    <div className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
                      {roundName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {round.matches.length} {round.matches.length === 1 ? 'Match' : 'Matches'}
                    </div>
                  </div>

                  {/* Matches */}
                  {round.matches.map((match, matchIndex) => {
                    // Calculate Y position with increasing gaps
                    const baseOffset = matchIndex * spacingMultiplier * (MATCH_HEIGHT + VERTICAL_GAP);
                    const centeringOffset = (spacingMultiplier - 1) * (MATCH_HEIGHT + VERTICAL_GAP) / 2;
                    const yPos = baseOffset + centeringOffset + 80; // 80 = header height

                    return (
                      <div
                        key={match.id || `match-${roundIndex}-${matchIndex}`}
                        className="absolute transition-all duration-300 hover:z-10"
                        style={{
                          top: yPos,
                          left: 0
                        }}
                      >
                        <MatchNode
                          match={match}
                          onClick={onMatchClick ? () => onMatchClick(match) : null}
                          isAdmin={isAdmin}
                        />
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      {rounds.length > 2 && (
        <div className="text-center mt-4 text-xs text-gray-500">
          ← Scroll horizontally to see all rounds →
        </div>
      )}
    </div>
  );
};

export default BracketTree;
