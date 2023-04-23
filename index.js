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

const connected = [];

function createNickname() {
  let index = Math.floor(Math.random() * nicknames.length);
  const nickname = nicknames[index];
  if (connected.includes(nickname)) {
    while (true) {
      if (nicknames[index + 1] === undefined) {
        while (true) {
          let num = 1;
            const newNickname = `${nickname} ${num}`;
            if (connected.includes(newNickname)) {
              num++;
            } else {
              connected.push(newNickname);
              return newNickname;
            }
        }
      } else {
        const newNickname = nicknames[index + 1];
        if (connected.includes(newNickname)) {
          index++;
        } else {
          connected.push(newNickname);
          return newNickname;
        }
      }
    }
  } else {
    connected.push(nickname);
    return nickname;
  }
}


io.on('connection', (socket) => {
  const nickname = createNickname();
  console.log(`${nickname} connected.`)
  io.emit('system message', `${nickname} connected.`);
  socket.on('chat message', (msg) => {
    io.emit('chat message', `${nickname}: ${msg}`);
    console.log(`${nickname}: ${msg}`)
  });
  socket.on('disconnect', () => {
    io.emit('system message', `${nickname} disconnected.`);
    // delete nickname from connected list
    const index = connected.indexOf(nickname);
    if (index > -1) {
        connected.splice(index, 1);
    }
    console.log(`${nickname} disconnected.`)
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
