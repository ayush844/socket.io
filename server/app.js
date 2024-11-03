import express from 'express';

import { Server } from 'socket.io';

import {createServer} from 'http'

import cors from 'cors';

import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const secretKeyJWT = "asdasdsadasdasdasdsa";


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


// middleware
io.use((socket, next) => {
    cookieParser()(socket.request, socket.request.res, (err) => {
      if (err) return next(err);
  
      const token = socket.request.cookies.token;
      if (!token) return next(new Error("Authentication Error"));
  
      const decoded = jwt.verify(token, secretKeyJWT);
      next();
    });
});


io.on('connection', (socket) => {
    console.log("user connected");
    console.log(`socket id: ${socket.id}`);

    socket.on("message", ({ room, message }) => {
        console.log({ room, message });
        socket.to(room).emit("receive-message", message);
    });

    socket.on("join-room", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });
    

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

app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, secretKeyJWT);
  
    res
      .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
      .json({
        message: "Login Success",
      });
});
  


server.listen(PORT, () => {
    console.log(`server is listening at port ${PORT}`);
})