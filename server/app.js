import express from 'express';

import { Server } from 'socket.io';

import {createServer} from 'http'

import cors from 'cors';

const PORT = 3000;


const app = express();

const server = createServer(app);


const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});


io.on('connection', (socket) => {
    console.log("user connected");
    console.log(`socket id: ${socket.id}`);

    

    //----------------- disconnecting user ----------------------------
    socket.on('disconnect', () => {
        console.log(`user disconnected ${socket.id}`);
    })
    //---------------------------------------------------------------

})


app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
}));


app.get('/', (req, res) => {
    res.send("hello ji");
})


server.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`);
})