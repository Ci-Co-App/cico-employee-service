const express = require("express");
const { upload, uploadImageToGCS } = require("../middlewares/attendanceMiddlewares");
const authMiddleware = require("../middlewares/authMiddlewares");
const { clockIn, clockOut, getAttendanceByID } = require("../controllers/attendanceController");

const router = express.Router();

router.post("/attendance/clock-in", authMiddleware, upload.single("evidence_photo"), uploadImageToGCS, clockIn);
router.post("/attendance/clock-out", authMiddleware, upload.single("evidence_photo"), uploadImageToGCS, clockOut);
router.get("/attendance", authMiddleware, getAttendanceByID);

module.exports = router;
