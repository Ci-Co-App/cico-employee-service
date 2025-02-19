const axios = require('axios');
const { Op } = require('sequelize');
const Attendance = require('../models/attendanceModel');

// Function to get formatted location from lat/lon
const getLocationDetails = async (latitude, longitude) => {
    try {
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.status !== "OK") {
            console.error("Google Maps API Error:", response.data.status);
            return null;
        }

        const results = response.data.results;
        if (results.length === 0) return null;

        let city = null, state = null, country = null;

        // Loop through all results to find the correct locality (city)
        for (const result of results) {
            for (const component of result.address_components) {
                if (component.types.includes("locality")) {
                    city = component.long_name;
                }
                if (component.types.includes("administrative_area_level_1")) {
                    state = component.long_name;
                }
                if (component.types.includes("country")) {
                    country = component.long_name;
                }
            }
        }

        // Fallback: If city is still null, try extracting "administrative_area_level_2" (which often represents the city)
        if (!city) {
            for (const result of results) {
                for (const component of result.address_components) {
                    if (component.types.includes("administrative_area_level_2")) {
                        city = component.long_name;
                        break;
                    }
                }
                if (city) break;
            }
        }

        const location = city && state && country ? `${city}, ${state}, ${country}` : null;
        return location;
    } catch (error) {
        console.error("Geolocation Error:", error);
        return null;
    }
};



// Clock-In Function
exports.clockIn = async (req, res) => {
    const user_id = req.user.id;
    const evidence_photo_clockin = req.file?.cloudStoragePublicUrl; 

    const latitude = req.body.latitude;
    const longitude = req.body.longitude || req.body.longtitude;

    if (!user_id || !evidence_photo_clockin || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Fetch location from Google Maps API
        const location_clockin = await getLocationDetails(latitude, longitude);
        // Create new clock-in record
        const attendance = await Attendance.create({
            user_id,
            clock_in: new Date(),
            evidence_photo_clockin,
            location_clockin
        });

        return res.status(201).json({
            message: "Clock-in successful",
            attendance
        });

    } catch (error) {
        console.error("Clock-in Error:", error);
        return res.status(500).json({ error: 'Failed to clock in', details: error.message });
    }
};


// Clock-Out Function
exports.clockOut = async (req, res) => {
    const user_id = req.user.id;
    const evidence_photo_clockout = req.file?.cloudStoragePublicUrl; // ✅ Clock-out photo
    const { latitude, longitude } = req.body;
    const clock_out = new Date();
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    if (!user_id || !evidence_photo_clockout || !latitude || !longitude) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Check if user has an active clock-in for today
        let attendance = await Attendance.findOne({
            where: {
                user_id,
                clock_in: { [Op.gte]: new Date(`${currentDate}T00:00:00.000Z`) },
                clock_out: null // Must not be clocked out already
            }
        });

        if (!attendance) {
            return res.status(400).json({ error: 'No active clock-in found for today' });
        }

        // Get formatted location (City, State, Country)
        const location_clockout = await getLocationDetails(latitude, longitude);

        // Update record with clock-out time, evidence, and location
        attendance.clock_out = clock_out;
        attendance.evidence_photo_clockout = evidence_photo_clockout;
        attendance.location_clockout = location_clockout;
        await attendance.save();

        return res.status(200).json({
            message: "Clock-out successful",
            attendance
        });

    } catch (error) {
        console.error("Clock-out Error:", error);
        return res.status(500).json({ error: 'Failed to clock out', details: error.message });
    }
};


// gett all attendance based on user id
exports.getAttendanceByID = async (req, res) => {
    const user_id = req.user.id;
    try {
        const attendance = await Attendance.findAll({
            where: { user_id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(attendance);
    }
    catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: 'Failed to fetch attendance', details: error.message });
    }

};