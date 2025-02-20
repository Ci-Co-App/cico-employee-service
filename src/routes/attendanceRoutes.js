const express = require("express");
const { upload, uploadImageToGCS } = require("../middlewares/attendanceMiddlewares");
const authMiddleware = require("../middlewares/authMiddlewares");
const { clockIn, clockOut, getAttendanceByID, attendanceStatus } = require("../controllers/attendanceController");

const router = express.Router();

router.post("/attendance/clock-in", authMiddleware, upload.single("evidence_photo"), uploadImageToGCS, clockIn);
router.post("/attendance/clock-out", authMiddleware, upload.single("evidence_photo"), uploadImageToGCS, clockOut);
router.get("/attendance", authMiddleware, getAttendanceByID);
router.get("/attendance/status", authMiddleware, attendanceStatus);

module.exports = router;
