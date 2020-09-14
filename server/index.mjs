import express from 'express';
import path from 'path';
import socketIO from 'socket.io';
import http from 'http';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { getColumnIdeas } from './model';
import {ws_message_handler} from './ws_message_handler';

const app = express();
const httpConnection = http.Server(app);
const io = socketIO(httpConnection);
const port = 3000;

app.get('/', function(req, res) {
  console.log(req.session.id);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.resolve(__dirname, '../client/prod/index.html'));
});


app.get('/initial.json', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(getColumnIdeas()));
});

app.use(express.static(path.resolve(__dirname, '../client/prod/')));

io.on('connection', (socket) => {
  console.log('a user connected');
  ws_message_handler(socket, io);
});


httpConnection.listen(port, () => {
  console.log('listening on *:' + port);
});