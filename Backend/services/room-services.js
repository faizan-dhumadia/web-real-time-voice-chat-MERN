const roomModels = require("../models/roomModels");

class RoomServices {
    async create(paylod) {
        const { topic, roomType, ownerId } = paylod;

        const room = await roomModels.create({ topic, roomType, ownerId, speakers: [ownerId] })
        return room
    }
    async getAllRooms(types) {
        const rooms = await roomModels.find({ roomType: { $in: types } }).populate('speakers').populate('ownerId').exec();

        return rooms;
    }
    async getRoom(roomId) {
        const room = await roomModels.findOne({ _id: roomId })
        return room
    }
}

module.exports = new RoomServices()