'use strict';

const Room = require('../models/room');
const User = require('../models/users');
const logs = require('../common/logs');
const RoomLog = require('../models/roomLog');

const log = new logs('Controllers-room');

async function roomCreate(req, res) {
    try {
        if (!req.user || !req.user.username) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const currentUser = await User.findOne({ username: req.user.username }).select('role').lean();

        if (!currentUser || currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can create rooms' });
        }

        const { userId, type, tag, email, phone, date, time, room } = req.body;
        const data = new Room({
            userId: userId,
            type: type,
            tag: tag,
            email: email,
            phone: phone,
            date: date,
            time: time,
            room: room,
        });

        const dataToSave = await data.save();
        return res.status(200).json(dataToSave);
    } catch (error) {
        log.error('Room create error', error);
        return res.status(400).json({ message: error.message });
    }
}

async function roomExists(req, res) {
    try {
        const { room } = req.body;

        const roomFindOne = await Room.findOne({ room: room });

        if (Object.is(roomFindOne, null) || !roomFindOne) {
            log.debug('Room not found!', room);
            return res.status(201).json({ message: false });
        }

        res.status(201).json({ message: true });
    } catch (error) {
        log.error('Room exists error', error);
        res.status(400).json({ message: error.message });
    }
}

async function roomFindBy(req, res) {
    try {
        const data = await Room.find({ userId: req.params.userId });
        res.json(data);
    } catch (error) {
        log.error('Room findByUserId error', error);
        res.status(400).json({ message: error.message });
    }
}

async function roomDeleteFindBy(req, res) {
    try {
        const data = await Room.deleteMany({ userId: req.params.userId });
        log.debug('deleAllRooms data', data);
        data.deletedCount > 0
            ? res.json({ message: `${data.deletedCount} documents has been deleted` })
            : res.json({ message: 'No documents found' });
    } catch (error) {
        log.error('Room findByUserId delete error', error);
        res.status(400).json({ message: error.message });
    }
}

async function roomGet(req, res) {
    try {
        const data = await Room.findById(req.params.id);
        res.json(data);
    } catch (error) {
        log.error('Room findById error', error);
        res.status(400).json({ message: error.message });
    }
}

async function roomUpdate(req, res) {
    try {
        const id = req.params.id;
        const allowedFields = ['type', 'tag', 'email', 'phone', 'date', 'time', 'room'];
        const updatedData = {};
        for (const field of allowedFields) {
            if (req.body[field] !== undefined) updatedData[field] = req.body[field];
        }
        const options = { returnDocument: 'after' };
        const result = await Room.findByIdAndUpdate(id, { $set: updatedData }, options);
        res.send(result);
    } catch (error) {
        log.error('Room update error', error);
        res.status(400).json({ message: error.message });
    }
}

async function roomDelete(req, res) {
    try {
        const id = req.params.id;
        const data = await Room.findByIdAndDelete(id);
        res.json({ message: `Document with ${data._id} has been deleted` });
    } catch (error) {
        log.error('Room delete error', error);
        res.status(400).json({ message: error.message });
    }
}

async function roomDeleteALL(req, res) {
    return res.json({ message: '⚠️ Route disabled' });
    try {
        const data = await Room.deleteMany();
        data.deletedCount > 0
            ? res.json({ message: `${data.deletedCount} documents has been deleted` })
            : res.json({ message: 'No documents found' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

async function roomLogCreate(req, res) {
    try {
        const {
            room_name,
            created_by,
            date,
            time,
        } = req.body;

        log.debug('[ROOM LOG API 1] Request received', {
            room_name,
            created_by,
            date,
            time,
        });

        const mandatoryFields = {
            room_name,
            created_by,
            date,
            time,
        };

        const missingFields = Object.entries(mandatoryFields)
            .filter(([, value]) => {
                return (
                    typeof value !== 'string' ||
                    value.trim() === ''
                );
            })
            .map(([field]) => field);

        if (missingFields.length > 0) {
            log.debug('[ROOM LOG API] Mandatory fields missing', {
                missingFields,
            });

            return res.status(422).json({
                message: 'Mandatory room-log fields are missing',
                fields: missingFields,
            });
        }

        const cleanRoomName = room_name.trim();
        const cleanCreatedBy = created_by.trim();
        const cleanDate = date.trim();
        const cleanTime = time.trim();

        const validDate =
            /^\d{4}-\d{2}-\d{2}$/.test(cleanDate);

        if (!validDate) {
            return res.status(422).json({
                message: 'Date must use YYYY-MM-DD format',
                field: 'date',
            });
        }

        const validTime =
            /^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(
                cleanTime
            );

        if (!validTime) {
            return res.status(422).json({
                message: 'Time must use HH:MM:SS format',
                field: 'time',
            });
        }

        log.debug('[ROOM LOG API 2] Saving room log', {
            room_name: cleanRoomName,
            created_by: cleanCreatedBy,
            date: cleanDate,
            time: cleanTime,
        });

        const roomLog = new RoomLog({
            room_name: cleanRoomName,
            created_by: cleanCreatedBy,
            date: cleanDate,
            time: cleanTime,
        });

        const savedRoomLog = await roomLog.save();

        log.debug('[ROOM LOG API 3] Room log saved', {
            id: savedRoomLog._id,
            room_name: savedRoomLog.room_name,
            created_by: savedRoomLog.created_by,
        });

        return res.status(201).json({
            message: 'Room log created successfully',
            data: savedRoomLog,
        });
    } catch (error) {
        log.error('[ROOM LOG API] Create error', error);

        if (error.name === 'ValidationError') {
            return res.status(422).json({
                message: error.message,
            });
        }

        return res.status(500).json({
            message: 'Unable to save room log',
            error: error.message,
        });
    }
}

async function roomLogFindAll(req, res) {
    try {
        const roomLogs = await RoomLog.find({})
            .select('room_name created_by date time createdAt')
            .sort({ createdAt: -1 })
            .lean();

        log.debug('[ROOM LOG API] Logs loaded', {
            count: roomLogs.length,
        });

        return res.status(200).json(roomLogs);
    } catch (error) {
        log.error('[ROOM LOG API] Find all error', error);

        return res.status(500).json({
            message: 'Unable to load room logs',
            error: error.message,
        });
    }
}

async function roomLogDelete(req, res) {
    try {
        const { id } = req.params;

        const deletedRoomLog = await RoomLog.findByIdAndDelete(id);

        if (!deletedRoomLog) {
            return res.status(404).json({
                message: 'Room log not found',
            });
        }

        log.debug('[ROOM LOG API] Room log deleted', {
            id: deletedRoomLog._id,
            room_name: deletedRoomLog.room_name,
            created_by: deletedRoomLog.created_by,
        });

        return res.status(200).json({
            message: 'Room log deleted successfully',
            id: deletedRoomLog._id,
        });
    } catch (error) {
        log.error('[ROOM LOG API] Delete error', error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                message: 'Invalid room log ID',
            });
        }

        return res.status(500).json({
            message: 'Unable to delete room log',
            error: error.message,
        });
    }
}

module.exports = {
    roomCreate,
    roomLogCreate,
    roomLogFindAll,
    roomLogDelete,
    roomExists,
    roomFindBy,
    roomDeleteFindBy,
    roomGet,
    roomUpdate,
    roomDelete,
    roomDeleteALL,
};
