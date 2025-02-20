require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());
app.use("/api/cico/employee", require("./routes/attendanceRoutes"));

// Sync Database
(async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected successfully!");
        await sequelize.sync();
        console.log("Database Synced");
    } catch (error) {
        console.error("Database connection error:", error);
    }
})();

const PORT = process.env.PORT || 8080; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
