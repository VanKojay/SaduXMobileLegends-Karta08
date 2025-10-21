import { useState, useEffect } from 'react';
import { Grid3x3, Users, Search, ChevronRight } from 'lucide-react';
import { groupService, adminService } from '../../services/api';
import toast from 'react-hot-toast';
import DashboardHeader from '../../components/common/DashboardHeader';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [groupsRes, teamsRes] = await Promise.all([
        groupService.listGroups(),
        adminService.teams.list(),
      ]);

      setGroups(groupsRes.data || []);
      setTeams(teamsRes.data || []);
    } catch (error) {
      console.error('Error fetching groups:', error);
      toast.error('Gagal memuat data groups');
    } finally {
      setIsLoading(false);
    }
  };

  const getTeamsInGroup = (groupId) => {
    return teams.filter(team => team.group_id === groupId);
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <DashboardHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Tournament Groups
          </h1>
          <p className="text-gray-400">Lihat pembagian grup tournament</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari group..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Groups Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-gray-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
            <Grid3x3 className="w-20 h-20 text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Belum Ada Groups</h3>
            <p className="text-gray-400">Groups belum dibuat oleh admin</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
              const groupTeams = getTeamsInGroup(group.id);

              return (
                <div
                  key={group.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all hover:scale-105 cursor-pointer"
                  onClick={() => setSelectedGroup(group)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-indigo-500/20 rounded-lg">
                        <Grid3x3 className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{group.name}</h3>
                        <p className="text-sm text-gray-400">
                          {groupTeams.length} Teams
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Teams Preview */}
                  <div className="space-y-2">
                    {groupTeams.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">Belum ada team di grup ini</p>
                    ) : (
                      groupTeams.slice(0, 3).map((team) => (
                        <div
                          key={team.id}
                          className="flex items-center space-x-2 p-2 bg-gray-700/30 rounded-lg"
                        >
                          <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm truncate">{team.name}</span>
                        </div>
                      ))
                    )}
                    {groupTeams.length > 3 && (
                      <p className="text-xs text-gray-500 text-center pt-1">
                        +{groupTeams.length - 3} more teams
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Group Detail Modal */}
        {selectedGroup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-800 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-indigo-500/20 rounded-lg">
                      <Grid3x3 className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedGroup.name}</h2>
                      <p className="text-gray-400">
                        {getTeamsInGroup(selectedGroup.id).length} Teams
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGroup(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6">
                {getTeamsInGroup(selectedGroup.id).length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                    <p className="text-gray-400">Belum ada team di grup ini</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getTeamsInGroup(selectedGroup.id).map((team, index) => (
                      <div
                        key={team.id}
                        className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10 bg-indigo-500/20 rounded-full">
                            <span className="text-indigo-400 font-bold">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{team.name}</h3>
                            <p className="text-sm text-gray-400">{team.email}</p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            team.status === 'approved'
                              ? 'bg-green-500/20 text-green-400'
                              : team.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {team.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Groups;
