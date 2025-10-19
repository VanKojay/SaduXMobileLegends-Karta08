import { sequelize, User, Event, Member, Team, Group, GroupTeam, Match, MatchRound, Stage, sync } from "./models/index.js";

// ensure DB tables are synced
sync()
  .then(() => console.log("✅ Sequelize synced models"))
  .catch((e) => console.error("Sequelize sync failed", e.message));

export { sequelize, User, Event, Member, Team, Group, GroupTeam, Match, MatchRound, Stage, sync };
