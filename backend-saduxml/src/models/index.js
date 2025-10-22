import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// === Konfigurasi koneksi database ===
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
  }
);

// === Import semua model ===
import defineUser from "./user.js";
import defineEvent from "./event.js";
import defineTeam from "./team.js";
import defineMember from "./member.js";
import defineGroup from "./group.js";
import defineGroupTeam from "./groupTeam.js";
import defineMatch from "./match.js";
import defineStage from "./stage.js";
import defineMatchRound from "./matchRound.js";

// === Inisialisasi model ===
const User = defineUser(sequelize);
const Event = defineEvent(sequelize);
const Team = defineTeam(sequelize);
const Member = defineMember(sequelize);
const Group = defineGroup(sequelize);
const GroupTeam = defineGroupTeam(sequelize);
const Match = defineMatch(sequelize);
const Stage = defineStage(sequelize);
const MatchRound = defineMatchRound(sequelize);

// ====================================================================
// 🔗 RELASI USER - EVENT
// ====================================================================

// Super Admin & Admin
User.hasMany(Event, { foreignKey: "created_by", as: "createdEvents" });
Event.belongsTo(User, { foreignKey: "created_by", as: "creator" });

// Jika admin hanya mengelola 1 event
User.belongsTo(Event, { foreignKey: "event_id", as: "managedEvent" });
Event.hasMany(User, { foreignKey: "event_id", as: "admins" });

// ====================================================================
// 🔗 RELASI EVENT DENGAN ENTITAS TURUNAN
// ====================================================================

// Event - Team
Event.hasMany(Team, { foreignKey: "event_id", as: "teams" });
Team.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event - Group
Event.hasMany(Group, { foreignKey: "event_id", as: "groups" });
Group.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event - Stage
Event.hasMany(Stage, { foreignKey: "event_id", as: "stages" });
Stage.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event - Match
Event.hasMany(Match, { foreignKey: "event_id", as: "matches" });
Match.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event - MatchRound
Event.hasMany(MatchRound, { foreignKey: "event_id", as: "matchRounds" });
MatchRound.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// ====================================================================
// 🔗 RELASI TEAM, MEMBER, DAN GROUP
// ====================================================================

// Team - Member
Team.hasMany(Member, { foreignKey: "team_id" });
Member.belongsTo(Team, { foreignKey: "team_id" });

// Group - GroupTeam
Group.hasMany(GroupTeam, { foreignKey: "group_id" });
GroupTeam.belongsTo(Group, { foreignKey: "group_id" });

// Team - GroupTeam
Team.hasMany(GroupTeam, { foreignKey: "team_id" });
GroupTeam.belongsTo(Team, { foreignKey: "team_id" });

// ====================================================================
// 🔗 RELASI MATCH DAN STAGE
// ====================================================================

// Stage - Match
Stage.hasMany(Match, { foreignKey: "stage_id" });
Match.belongsTo(Stage, { foreignKey: "stage_id" });

// Stage - MatchRound
Stage.hasMany(MatchRound, { foreignKey: "stage_id" });
MatchRound.belongsTo(Stage, { foreignKey: "stage_id" });

// Match - MatchRound
Match.hasMany(MatchRound, { foreignKey: "match_id" });
MatchRound.belongsTo(Match, { foreignKey: "match_id" });

// ====================================================================
// 🔗 RELASI TEAM DALAM MATCH (team1, team2, winner)
// ====================================================================

Team.hasMany(Match, { foreignKey: "team1_id", as: "Team1" });
Team.hasMany(Match, { foreignKey: "team2_id", as: "Team2" });
Team.hasMany(Match, { foreignKey: "winner_id", as: "Winner" });

Match.belongsTo(Team, { foreignKey: "team1_id", as: "Team1" });
Match.belongsTo(Team, { foreignKey: "team2_id", as: "Team2" });
Match.belongsTo(Team, { foreignKey: "winner_id", as: "Winner" });

// MatchRound - Team (pemenang ronde)
MatchRound.belongsTo(Team, { foreignKey: "winner_id", as: "winnerTeam" });

// ====================================================================
// 🔧 Sinkronisasi Database
// ====================================================================
const sync = async () => {
  await sequelize.sync({ alter: true });
  console.log("✅ Database & models synchronized successfully!");
};

// ====================================================================
// 📦 Export Semua Model
// ====================================================================
export {
  sequelize,
  User,
  Event,
  Team,
  Member,
  Group,
  GroupTeam,
  Match,
  Stage,
  MatchRound,
  sync,
};