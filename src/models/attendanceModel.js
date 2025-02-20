const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Attendance = sequelize.define('Attendance', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    clock_in: {
        type: DataTypes.DATE,
        allowNull: false
    },
    clock_out: {
        type: DataTypes.DATE,
        allowNull: true
    },
    evidence_photo_clockin: {
        type: DataTypes.STRING,
        allowNull: true
    },
    evidence_photo_clockout: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location_clockin: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location_clockout: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Attendance;