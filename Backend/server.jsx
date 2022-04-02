require('dotenv').config();
const express = require('express')
const app = express()
const port = process.env.PORT || 5500
const router = require('./routes')
const cors = require('cors');
const dbConnet = require('./database');
const cookieParser = require('cookie-parser');
const ACTION = require('./action');
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        method: ['GET', 'POST']
    }
})
const corsOption = {
    origin: 'http://localhost:3000',
    credentials: true,
}



dbConnet();
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded());
app.use(cookieParser());


app.use(cors(corsOption));
app.use(router)
app.use('/storage', express.static('storage'))


app.get('/', (req, res) => {
    res.send('Hello World!')
})


//socket logic

const socketUserMapping = {

}
io.on('connection', (socket) => {
    console.log('new Connection:', socket.id);
    socket.on(ACTION.JOIN, ({ roomId, user }) => {
        socketUserMapping[socket.id] = user;

        // get all the clients from io adapter
        const client = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        client.forEach((clientId) => {
            io.to(clientId).emit(ACTION.ADD_PEER, {
                peerId: socket.id,
                createOffer: false,
                user
            })

            // Send myself as well that much msgs how many clients
            socket.emit(ACTION.ADD_PEER, {
                peerId: clientId,
                createOffer: true,
                user: socketUserMapping[clientId]
            })
        })
        socket.join(roomId);

        console.log(client);
    });
    //handle relay ice
    socket.on(ACTION.RELAY_ICE, ({ peerId, icecandidate }) => {
        io.to(peerId).emit(ACTION.ICE_CANDIDATE, { peerId: socket.id, icecandidate })
    })

    //handle relay sdp(session description)
    socket.on(ACTION.RELAY_SDP, ({ peerId, sessionDescription }) => {
        io.to(peerId).emit(ACTION.SESSION_DESCRIPTION, {
            peerId: socket.id,
            sessionDescription
        })
    })

    //handle mute and unmute
    socket.on(ACTION.MUTE, ({ roomId, userId }) => {
        console.log('muted on a server', userId);
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTION.MUTE, {
                peerId: socket.id,
                userId
            })
        })
    })

    socket.on(ACTION.UNMUTE, ({ roomId, userId }) => {
        console.log('unmuted on a server', userId);
        const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])
        clients.forEach(clientId => {
            io.to(clientId).emit(ACTION.UNMUTE, {
                peerId: socket.id,
                userId
            })
        })
    })


    //Leave Room
    const leaveRoom = () => {
        const { rooms } = socket;
        console.log('Leaving', rooms);

        // console.log('socketUserMap', socketUserMap);
        Array.from(rooms).forEach((roomId) => {
            const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || [])

            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTION.REMOVE_PEER, {
                    peerId: socket.id,
                    userId: socketUserMapping[socket.id]?.id,
                })

                socket.emit(ACTION.REMOVE_PEER, {
                    peerId: clientId,
                    userId: socketUserMapping[clientId]?.id,
                })
            })
            socket.leave(roomId);
        })


        delete socketUserMapping[socket.id];

        console.log('map', socketUserMapping);
    }
    socket.on(ACTION.LEAVE, leaveRoom);
    socket.on('disconnecting', leaveRoom);

})

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})