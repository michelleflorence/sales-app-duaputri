import ActivityLog from "../models/ActivityLogModel.js";
import { Sequelize, fn } from "sequelize";

const getLogActivities = async (req, res) => {
  try {
    // Mengambil data log aktivitas dari database
    const logs = await ActivityLog.findAll({
      attributes: [
        "id",
        "officerId",
        "action",
        "target",
        "createdAt",
        "updatedAt",
      ],
      order: [["createdAt", "DESC"]],
    });

    // Mengonversi format tanggal pada setiap log
    const formattedLogs = logs.map((log) => ({
      id: log.id,
      officerId: log.officerId,
      action: log.action,
      target: log.target,
      createdAt: log.createdAt.toISOString().split("T")[0],
      updatedAt: log.updatedAt.toISOString().split("T")[0],
    }));

    res.status(200).json(formattedLogs);
  } catch (error) {
    // Menangani kesalahan server dan memberikan pesan error
    res.status(500).json({ msg: error.message });
  }
};

export { getLogActivities };
