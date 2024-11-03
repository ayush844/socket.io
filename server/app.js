import express from 'express';

import { Server } from 'socket.io';

const PORT = 3000;


const app = express();

const server = new Server(app);

const io = new Server(server);


io.on('connection', (socket) => {
    console.log("user connected");
})

app.get('/', (req, res) => {
    res.send("hello ji");
})


app.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`);
})