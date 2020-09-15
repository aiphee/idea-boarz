import express from 'express';
import path from 'path';
import socketIO from 'socket.io';
import http from 'http';
import session from 'express-session';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { getColumnIdeas } from './model';
import {ws_message_handler} from './ws_message_handler';

const app = express();
const httpConnection = http.Server(app);
const io = socketIO(httpConnection);
const port = 3000;

var sessionMiddleware = session({
  secret: "My Precious! 💍",
  saveUninitialized: true, // We need session just for id now
  resave: false
});

app.use(sessionMiddleware);

io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

app.get('/', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.sendFile(path.resolve(__dirname, '../client/prod/index.html'));
});


app.get('/initial.json', function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(getColumnIdeas()));
});

app.use(express.static(path.resolve(__dirname, '../client/prod/')));

io.on('connection', (socket) => {
  console.log(`user ${socket.request.session.id} connected`);
  ws_message_handler(socket, io);
});


httpConnection.listen(port, () => {
  console.log('listening on *:' + port);
});