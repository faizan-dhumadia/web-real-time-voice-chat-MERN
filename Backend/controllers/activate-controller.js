const Jimp = require('jimp')
const path = require('path');
const UserDto = require('../dtos/user-dto');
const usersServices = require('../services/users-services');
class ActivateController {
    async activate(req, res) {
        const { name, avatar } = req.body
        if (!name || !avatar) {
            res.status(400).json({ message: "all field are requires" })
        }

        const buffer = Buffer.from(avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ''), 'base64');
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`

        try {
            const jimpResp = await Jimp.read(buffer)
            jimpResp.resize(150, Jimp.AUTO).write(path.resolve(__dirname, `../storage/${imagePath}`))
        } catch (error) {
            res.status(500).json({ message: "could not process the image" })
        }
        const userId = req.user._id
        try {

            const user = await usersServices.findUser({ _id: userId })
            if (!user) {
                res.status(404).json({ message: "user not found" })
            }
            user.activated = true
            user.name = name
            user.avatar = `/storage/${imagePath}`
            user.save()
            res.json({ user: new UserDto(user), auth: true })
        } catch (error) {
            res.status(500).json({ message: "something wrong" })

        }
    }
}

module.exports = new ActivateController();