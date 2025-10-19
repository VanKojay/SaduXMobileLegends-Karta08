import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST || "localhost",
  dialect: "mysql",
  logging: false,
});

// === Import semua model ===
import defineUser from "./user.js";
import defineEvent from "./event.js";
import defineTeam from "./team.js";
import defineMember from "./member.js";
import defineGroup from "./group.js";
import defineGroupTeam from "./groupTeam.js";
import defineMatch from "./match.js";

// === Inisialisasi model ===
const User = defineUser(sequelize);
const Event = defineEvent(sequelize);
const Team = defineTeam(sequelize);
const Member = defineMember(sequelize);
const Group = defineGroup(sequelize);
const GroupTeam = defineGroupTeam(sequelize);
const Match = defineMatch(sequelize);

// === Relasi yang sudah ada ===
User.hasMany(Event, { foreignKey: "created_by" });
Event.belongsTo(User, { foreignKey: "created_by" });

Team.hasMany(Member, { foreignKey: "team_id" });
Member.belongsTo(Team, { foreignKey: "team_id" });

// === Relasi baru untuk sistem pertandingan ===

// Grup bisa punya banyak tim (via GroupTeam)
Group.hasMany(GroupTeam, { foreignKey: "group_id" });
GroupTeam.belongsTo(Group, { foreignKey: "group_id" });

// Tim bisa tergabung ke banyak grup (via GroupTeam)
Team.hasMany(GroupTeam, { foreignKey: "team_id" });
GroupTeam.belongsTo(Team, { foreignKey: "team_id" });

// Grup punya banyak pertandingan
Group.hasMany(Match, { foreignKey: "group_id" });
Match.belongsTo(Group, { foreignKey: "group_id" });

// Relasi antar tim dalam match
Team.hasMany(Match, { foreignKey: "team1_id", as: "MatchesAsTeam1" });
Team.hasMany(Match, { foreignKey: "team2_id", as: "MatchesAsTeam2" });
Team.hasMany(Match, { foreignKey: "winner_id", as: "MatchesAsWinner" });

Match.belongsTo(Team, { foreignKey: "team1_id", as: "Team1" });
Match.belongsTo(Team, { foreignKey: "team2_id", as: "Team2" });
Match.belongsTo(Team, { foreignKey: "winner_id", as: "Winner" });

const sync = async () => {
  await sequelize.sync({ alter: true });
};

export { sequelize, User, Event, Team, Member, Group, GroupTeam, Match, sync };
