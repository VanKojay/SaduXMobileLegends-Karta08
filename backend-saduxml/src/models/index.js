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

// === RELASI EXISTING ===

// User - Event
User.hasMany(Event, { foreignKey: "created_by" });
Event.belongsTo(User, { foreignKey: "created_by" });

// Team - Member
Team.hasMany(Member, { foreignKey: "team_id" });
Member.belongsTo(Team, { foreignKey: "team_id" });

// Group - GroupTeam
Group.hasMany(GroupTeam, { foreignKey: "group_id" });
GroupTeam.belongsTo(Group, { foreignKey: "group_id" });

// Team - GroupTeam
Team.hasMany(GroupTeam, { foreignKey: "team_id" });
GroupTeam.belongsTo(Team, { foreignKey: "team_id" });

// Group - Match
Group.hasMany(Match, { foreignKey: "group_id" });
Match.belongsTo(Group, { foreignKey: "group_id" });

// === RELASI BARU: SISTEM TURNAMEN ===

// Stage - Match
Stage.hasMany(Match, { foreignKey: "stage_id" });
Match.belongsTo(Stage, { foreignKey: "stage_id" });

// Stage - MatchRound (opsional)
Stage.hasMany(MatchRound, { foreignKey: "stage_id" });
MatchRound.belongsTo(Stage, { foreignKey: "stage_id" });

// Match - MatchRound
Match.hasMany(MatchRound, { foreignKey: "match_id" });
MatchRound.belongsTo(Match, { foreignKey: "match_id" });

// Team (relasi dalam Match)
Team.hasMany(Match, { foreignKey: "team1_id", as: "Team1" });
Team.hasMany(Match, { foreignKey: "team2_id", as: "Team2" });
Team.hasMany(Match, { foreignKey: "winner_id", as: "Winner" });

Match.belongsTo(Team, { foreignKey: "team1_id", as: "Team1" });
Match.belongsTo(Team, { foreignKey: "team2_id", as: "Team2" });
Match.belongsTo(Team, { foreignKey: "winner_id", as: "Winner" });

// MatchRound - Team (pemenang ronde)
MatchRound.belongsTo(Team, { foreignKey: "winner_id" });

// === Sinkronisasi Database ===
const sync = async () => {
  await sequelize.sync({ alter: true });
};

// === Export semua model dan koneksi ===
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
