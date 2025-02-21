require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize_employee = require("./config/db");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use("/api/cico/employee", require("./routes/attendanceRoutes"));

app.get("/", (req, res) => {
    res.send("Welcome to API Employee");
});

// Sync Database
(async () => {
    try {

        console.log("Connecting to Employee DB...");
        await sequelize_employee.authenticate();
        console.log("✅ Employee DB Connected!");

        await sequelize_employee.sync();
        console.log("✅ Database Synced Successfully!");
    } catch (error) {
        console.error("❌ Database connection error:", error);
    }
})();

const PORT = process.env.PORT || 3002; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
