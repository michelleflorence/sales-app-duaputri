import { DataTypes } from "sequelize";
import db from "../config/Database.js";
import Officers from "./OfficerModel.js";

const ActivityLog = db.define("ActivityLog", {
  officerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  target: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Officers.hasMany(ActivityLog);
ActivityLog.belongsTo(Officers, { foreignKey: "officerId" });

export default ActivityLog;
