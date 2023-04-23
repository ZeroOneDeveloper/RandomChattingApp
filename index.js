const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

nicknames = [
    'Prodo',
    'Muzi',
    'Ryan',
];

connected = [];

io.on('connection', (socket) => {
  let nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
  if (connected.includes(nickname)) {
    if (connected.includes(...nicknames)) {
      while (true) {
        let number = 1;
        let assistNickname = `${nickname} ${number}`;
        if (connected.includes(assistNickname)) {
          number++;
        } else {
          connected.push(assistNickname);
          break;
        }
      }
    } else {
      connected.push(nickname);
    }
  } else {
    connected.push(nickname);
  }
  console.log(`${nickname} connected.`)
  io.emit('system message', `${nickname} connected.`);
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${nickname}: ${msg}`);
    console.log(`${nickname}: ${msg}`)
  });
  socket.on('disconnect', () => {
    io.emit('system message', `${nickname} disconnected.`);
    console.log(`${nickname} disconnected.`)
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
