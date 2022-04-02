const mongoose = require("mongoose")

function dbConnet() {

    const mongoString = process.env.DB_URL

    mongoose.connect(mongoString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
    })

    mongoose.connection.on("error", function (error) {
        console.log(error)
    })

    mongoose.connection.on("open", function () {
        console.log("Connected to MongoDB database.")
    })
}

module.exports = dbConnet;