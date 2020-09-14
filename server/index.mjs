import express from 'express';
import path from 'path';
import expressWs from 'express-ws';
import session from 'express-session';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

import { getColumnIdeas } from './model';
import {ws_message_handler} from './ws_message_handler';

const app = express();
const ws = expressWs(app);
const port = 3000;

app.use(session({
  secret: "My Precious! 💍",
  saveUninitialized: true, // We need session just for id now
  resave: false
}));

app.get('/', function(req, res) {
  console.log(req.session.id);
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

app.ws('/', (socket, req) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.setHeader('Content-Type', 'application/json');
  console.log('a user connected');

  ws_message_handler(socket, req);
});

app.listen(port, () => {
  console.log('listening on *:' + port);
});