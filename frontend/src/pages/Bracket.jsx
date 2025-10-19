import { useState, useEffect } from 'react';
import { Trophy, ArrowLeft, Zap, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const Bracket = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize Socket.IO connection
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected');
      setIsConnected(true);
      toast.success('Connected to live updates');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
      toast.error('Disconnected from live updates');
    });

    // Listen for bracket updates
    newSocket.on('bracket:update', (data) => {
      console.log('Bracket update received:', data);
      setMatches(data.matches || []);
    });

    // Listen for match updates
    newSocket.on('match:update', (data) => {
      console.log('Match update received:', data);
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match.id === data.matchId ? { ...match, ...data.updates } : match
        )
      );
      toast.success('Match updated!');
    });

    setSocket(newSocket);

    // Fetch initial bracket data
    fetchBracketData();

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const fetchBracketData = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await api.get('/bracket');
      // setMatches(response.data);
      
      // Dummy data untuk demo
      const dummyMatches = [
        {
          id: 1,
          round: 'Semifinals',
          team1: { name: 'Team Alpha', score: 2 },
          team2: { name: 'Team Beta', score: 1 },
          status: 'completed',
          matchNumber: 1,
        },
        {
          id: 2,
          round: 'Semifinals',
          team1: { name: 'Team Gamma', score: 1 },
          team2: { name: 'Team Delta', score: 2 },
          status: 'completed',
          matchNumber: 2,
        },
        {
          id: 3,
          round: 'Finals',
          team1: { name: 'Team Alpha', score: 0 },
          team2: { name: 'Team Delta', score: 0 },
          status: 'upcoming',
          matchNumber: 3,
        },
      ];
      
      setTimeout(() => {
        setMatches(dummyMatches);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching bracket:', error);
      toast.error('Gagal memuat bracket');
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'live':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <Circle className="w-3 h-3 fill-current animate-pulse" />;
      case 'upcoming':
        return <Zap className="w-3 h-3" />;
      case 'completed':
        return <Trophy className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Group matches by round
  const groupedMatches = matches.reduce((acc, match) => {
    const round = match.round || 'Unknown';
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold">Tournament Bracket</h1>
                <p className="text-sm text-gray-400">Live Updates</p>
              </div>
            </div>

            {/* Connection Status */}
            <div
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border ${
                isConnected
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}
            >
              <Circle className={`w-2 h-2 fill-current ${isConnected ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-400">Loading bracket...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy className="w-24 h-24 text-gray-700 mb-6" />
            <h2 className="text-2xl font-bold mb-2">Bracket Belum Tersedia</h2>
            <p className="text-gray-400 max-w-md">
              Tournament bracket akan di-generate setelah periode pendaftaran selesai dan admin melakukan approval.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedMatches).map(([round, roundMatches]) => (
              <div key={round}>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {round}
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {roundMatches.map((match) => (
                    <div
                      key={match.id}
                      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
                    >
                      {/* Match Header */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-400">Match #{match.matchNumber}</span>
                        <span
                          className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            match.status
                          )}`}
                        >
                          {getStatusIcon(match.status)}
                          <span>{match.status}</span>
                        </span>
                      </div>

                      {/* Teams */}
                      <div className="space-y-3">
                        {/* Team 1 */}
                        <div
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            match.status === 'completed' &&
                            match.team1.score > match.team2.score
                              ? 'bg-indigo-500/20 border border-indigo-500/30'
                              : 'bg-gray-700/30'
                          }`}
                        >
                          <span className="font-semibold">{match.team1.name}</span>
                          <span className="text-2xl font-bold">{match.team1.score}</span>
                        </div>

                        {/* VS Divider */}
                        <div className="text-center text-sm text-gray-500 font-medium">VS</div>

                        {/* Team 2 */}
                        <div
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            match.status === 'completed' &&
                            match.team2.score > match.team1.score
                              ? 'bg-indigo-500/20 border border-indigo-500/30'
                              : 'bg-gray-700/30'
                          }`}
                        >
                          <span className="font-semibold">{match.team2.name}</span>
                          <span className="text-2xl font-bold">{match.team2.score}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Bracket;
