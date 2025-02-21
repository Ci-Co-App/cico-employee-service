const dotenv = require('dotenv');
dotenv.config();
const multer = require('multer');
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// ✅ Use Google’s default authentication (Cloud Run auto-detects)
const storage = new Storage();

const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    }
});

const uploadImageToGCS = async (req, res, next) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = `attendance_photos/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
        resumable: false,
        metadata: { contentType: req.file.mimetype },
    });

    stream.on("error", (err) => {
        console.error("GCS Upload Error:", err);
        return res.status(500).json({ error: "Failed to upload file to GCS", details: err.message });
    });

    stream.on("finish", () => {
        req.file.cloudStoragePublicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
        next();
    });

    stream.end(req.file.buffer);
};

module.exports = { upload, uploadImageToGCS };
