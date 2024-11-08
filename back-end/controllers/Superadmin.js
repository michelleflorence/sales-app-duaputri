import Officer from "../models/OfficerModel.js";
import argon2 from "argon2";

const seedSuperAdmin = async () => {
  try {
    // Check if there are any officers
    const officersCount = await Officer.count();

    // If no officers exist, create a superadmin
    if (officersCount === 0) {
      const hashedPassword = await argon2.hash("michelle123");

      await Officer.create({
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: hashedPassword,
        roles: "superadmin", // Ensure to adjust roles as per your role structure
      });

      console.log("Superadmin created successfully!");
    }
  } catch (error) {
    console.error("Error seeding superadmin:", error);
  }
};

export default seedSuperAdmin;
