'use strict';

const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  //1人目
  socket.on("from_client", function(msg){
   console.log("receive: " + msg);

   console.log("send message");
   socket.emit("from_server", msg);
  });

  //2人目
  socket.on("from_client2", function(msg){
   console.log("receive2: " + msg);

   console.log("send message2");
   socket.emit("from_server2", msg);
  });

});

