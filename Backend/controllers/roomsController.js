const roomServices = require("../services/room-services")
const RoomDto = require('../dtos/room-dto')

class RoomsController {

    async create(req, res) {
        const { roomType, topic } = req.body
        if (!topic || !roomType) {
            return res.status(400).json({ message: "All fields are requires " })
        }

        const room = await roomServices.create({ topic, roomType, ownerId: req.user._id })

        return res.json(new RoomDto(room))
    }

    async index(req, res) {
        const rooms = await roomServices.getAllRooms(['open'])
        const allRooms = rooms.map((room) => new RoomDto(room))
        console.log("All Rooms:", allRooms);
        return res.json(allRooms)
    }

    async show(req, res) {
        const room = await roomServices.getRoom(req.params.roomId)
        return res.json(room)
    }

}

module.exports = new RoomsController()