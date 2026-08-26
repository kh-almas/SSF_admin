'use strict';

const mongoose = require('mongoose');

const roomLogSchema = new mongoose.Schema(
    {
        room_name: {
            type: String,
            required: [true, 'Room name is required'],
            trim: true,
            maxlength: 255,
            index: true,
        },

        created_by: {
            type: String,
            required: [true, 'Created by is required'],
            trim: true,
            maxlength: 255,
            index: true,
        },

        date: {
            type: String,
            required: [true, 'Date is required'],
            trim: true,
            match: [
                /^\d{4}-\d{2}-\d{2}$/,
                'Date must use YYYY-MM-DD format',
            ],
            index: true,
        },

        time: {
            type: String,
            required: [true, 'Time is required'],
            trim: true,
            match: [
                /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/,
                'Time must use HH:MM:SS format',
            ],
        },
    },
    {
        timestamps: true,
        collection: 'room_logs',
    }
);

module.exports = mongoose.model('RoomLog', roomLogSchema);