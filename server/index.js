const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

const app = express();
const httpConnection = http.Server(app);
const io = socketIO(httpConnection);
const port = 3000;

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, '../client/prod/index.html'));
});
app.use(express.static(path.resolve(__dirname, '../client/prod/')))


io.on('connection', socket => {
  console.log('a user connected');
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


httpConnection.listen(port, () => {
  console.log('listening on *:' + port);
});