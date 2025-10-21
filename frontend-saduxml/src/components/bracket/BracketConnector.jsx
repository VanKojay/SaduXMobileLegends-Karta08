/**
 * BracketConnector - Renders SVG lines connecting bracket matches
 */

const BracketConnector = ({
  fromX,
  fromY,
  toX,
  toY,
  isLive = false,
  className = ''
}) => {
  // Calculate midpoint for horizontal line
  const midX = fromX + (toX - fromX) / 2;

  // Path: horizontal from match → vertical to midpoint → horizontal to next match
  const pathD = `
    M ${fromX} ${fromY}
    L ${midX} ${fromY}
    L ${midX} ${toY}
    L ${toX} ${toY}
  `;

  return (
    <path
      d={pathD}
      fill="none"
      stroke={isLive ? '#3b82f6' : '#4b5563'}
      strokeWidth={isLive ? 3 : 2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-all ${className} ${isLive ? 'animate-pulse' : ''}`}
      style={{
        filter: isLive ? 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))' : 'none'
      }}
    />
  );
};

/**
 * BracketConnectorVertical - Connects two matches in same round (for pairing)
 */
export const BracketConnectorVertical = ({
  x,
  fromY,
  toY,
  className = ''
}) => {
  return (
    <line
      x1={x}
      y1={fromY}
      x2={x}
      y2={toY}
      stroke="#4b5563"
      strokeWidth={2}
      strokeLinecap="round"
      className={className}
    />
  );
};

/**
 * RoundConnector - Connects all matches in a round to next round
 */
export const RoundConnector = ({
  matches,
  nextRoundMatches,
  roundIndex,
  matchHeight = 120,
  matchWidth = 256,
  roundGap = 100,
  verticalGap = 40
}) => {
  if (!nextRoundMatches || nextRoundMatches.length === 0) return null;

  const lines = [];
  const startX = (roundIndex + 1) * (matchWidth + roundGap);

  matches.forEach((match, matchIndex) => {
    const nextMatchIndex = Math.floor(matchIndex / 2);
    const nextMatch = nextRoundMatches[nextMatchIndex];

    if (!nextMatch) return;

    const fromY = matchIndex * (matchHeight + verticalGap) + matchHeight / 2;
    const toY = nextMatchIndex * (matchHeight + verticalGap * 2) + matchHeight / 2;

    const isLive = match.status === 'live' || match.status === 'ongoing';

    lines.push(
      <BracketConnector
        key={`connector-${roundIndex}-${matchIndex}`}
        fromX={startX}
        fromY={fromY}
        toX={startX + roundGap}
        toY={toY}
        isLive={isLive}
      />
    );
  });

  return <>{lines}</>;
};

export default BracketConnector;
