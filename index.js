require("dotenv").config();
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
    res.send("Hello, Express with .env!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
