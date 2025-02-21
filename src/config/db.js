const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log("🔍 Connecting to Employee DB:", process.env.DB_NAME_EMPLOYEE, "on", process.env.DB_HOST);

const sequelize_employee = new Sequelize(
  process.env.DB_NAME_EMPLOYEE,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT || 3306,  // Ensure port is set
    dialectOptions: process.env.DB_SSL === "true" ? {
      ssl: { require: true, rejectUnauthorized: false }
    } : {},
    logging: console.log, // Enable detailed logging
    pool: {
      max: 10,
      min: 0,
      acquire: 120000, // ⏳ Increase timeout
      idle: 30000
    }
  }
);

// Test connection immediately
(async () => {
  try {
    console.log("🔄 Testing direct Employee DB connection...");
    await sequelize_employee.authenticate();
    console.log("✅ Employee DB connection successful!");
  } catch (error) {
    console.error("❌ Direct Employee DB test failed:", error);
  }
})();

module.exports = sequelize_employee;
