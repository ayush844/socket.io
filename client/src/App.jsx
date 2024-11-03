import { useEffect, useState } from 'react'
import './App.css'

import {io} from "socket.io-client"

function App() {
  const socket = io("http://localhost:3000");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    })


    // triggering disconnect event
    return () => {
      socket.disconnect();
    }

  }, [])

  //-----------------------listening to the event-----------------------
  socket.on("welcome", (s) => {console.log(s)})
  //---------------------------------------------------------------------

  return (
    <>
    HELLO
    </>
  )
}

export default App
