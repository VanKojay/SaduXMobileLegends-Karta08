import { useState, useEffect } from 'react';
import { Calendar, Layers, Search, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { stageService } from '../../services/api';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/common/DashboardHeader';

const Schedule = () => {
  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      setIsLoading(true);
      const response = await stageService.listStages();
      setStages(response.data || []);
    } catch (error) {
      console.error('Error fetching stages:', error);
      toast.error('Gagal memuat data stages');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStages = stages.filter(stage =>
    stage.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'ongoing':
        return <PlayCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'ongoing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Tournament Schedule
          </h1>
          <p className="text-gray-400">Lihat jadwal dan tahapan tournament</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari stage..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-500/20 rounded-lg">
                <Layers className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stages.length}</p>
                <p className="text-sm text-gray-400">Total Stages</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-500/20 rounded-lg">
                <PlayCircle className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stages.filter(s => s.status === 'ongoing').length}
                </p>
                <p className="text-sm text-gray-400">Ongoing</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-green-500/20 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {stages.filter(s => s.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredStages.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
            <Calendar className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Belum Ada Schedule</h3>
            <p className="text-gray-400">Schedule tournament belum dibuat oleh admin</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredStages.map((stage, index) => (
              <div
                key={stage.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Timeline indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                        stage.status === 'completed'
                          ? 'bg-green-500/20 border-green-500'
                          : stage.status === 'ongoing'
                          ? 'bg-blue-500/20 border-blue-500 animate-pulse'
                          : 'bg-yellow-500/20 border-yellow-500'
                      }`}>
                        {getStatusIcon(stage.status)}
                      </div>
                      {index < filteredStages.length - 1 && (
                        <div className="w-0.5 h-16 bg-gray-700 mt-2" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold">{stage.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(stage.status)}`}>
                          {stage.status || 'upcoming'}
                        </span>
                      </div>

                      {stage.description && (
                        <p className="text-gray-400 mb-3">{stage.description}</p>
                      )}

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-gray-500">Start Date</p>
                            <p className="text-gray-300">{formatDate(stage.start_date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-gray-500">End Date</p>
                            <p className="text-gray-300">{formatDate(stage.end_date)}</p>
                          </div>
                        </div>
                      </div>

                      {stage.type && (
                        <div className="mt-3">
                          <span className="inline-block px-2.5 py-1 bg-purple-500/10 text-purple-400 rounded text-xs font-medium">
                            {stage.type}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Schedule;
