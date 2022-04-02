const userModels = require("../models/userModels");

class UserServices {
    async findUser(filter) {
        const user = await userModels.findOne(filter);
        return user
    }

    async createUser(data) {
        const user = await userModels.create(data)
        return user
    }
}

module.exports = new UserServices();