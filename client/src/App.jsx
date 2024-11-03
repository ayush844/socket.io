import { useEffect, useMemo, useState } from 'react'
import './App.css'

import {io} from "socket.io-client"
import { Button, Container, Stack, TextField, Typography } from '@mui/material';

function App() {

  // we will use useMemo here so that it will not change everytime
  const socket = useMemo(() => io("http://localhost:3000", {withCredentials: true}), []);

  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");

  const [messages, setMessages] = useState([]);

  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    })

    socket.on("receive-message", (data) => {
      console.log(`received ${data}`);
      setMessages((messages) => [...messages, data])
    })

    // triggering disconnect event
    return () => {
      socket.disconnect();
    }

  }, [])

  //-----------------------listening to the event-----------------------
  socket.on("welcome", (s) => {console.log(s)})
  //---------------------------------------------------------------------

  console.log(messages);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", {message, room});
    setMessage("");
  }

  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant='h1' component="div" gutterBottom>
        welcome to socket.io
      </Typography>

      <Typography  variant='h4' component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={joinRoomHandler}>
        <h5>Join Room</h5>
        <TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Join
        </Button>
      </form>


      <form onSubmit={handleSubmit}>
        <TextField value={message} onChange={e => setMessage(e.target.value)} id='outlined-basic' label='Message' variant='outlined' />
        <TextField value={room} onChange={e => setRoom(e.target.value)} id='outlined-basic' label='Room' variant='outlined' />
        <Button type='submit' variant='contained' color='primary'>Send</Button>
      </form>


      <Stack>
        {messages.map((m, i) => (
          <Typography key={i} variant="h6" component="div" gutterBottom>
            {m}
          </Typography>
        ))}
      </Stack>


    </Container>
  )
}

export default App
