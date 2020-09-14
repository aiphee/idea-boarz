import actions from '../shared/events.json';
import { insertIdea } from './model';

export const ws_message_handler = (socket, req) => {
  console.log({
    'bob': req.session.id,
  });
  const eventActions = {
    [actions.IDEA_CREATE_C]: (payload) => {
      console.log({
        'builder': req.session.id,
      });

      const colId = payload.newTextColId;
      const text = payload.newTextContent;

      const { lastInsertRowid } = insertIdea({
        text: text,
        guest_hash: '1ff',
        col_id: colId,
      })

      socket.send(JSON.stringify({
        type: actions.IDEA_CREATE_S,
        payload: {
          id: lastInsertRowid,
          text: text,
          col_id: colId,
          guest_hash: '1ff',
          likes: 0,
          deleted: 0,
        },
      }));
    },
  };

  socket.on('disconnect', (msg) => console.log('user disconnected'));

  socket.on('message', (msg) => {
    msg = JSON.parse(msg);

    for (const [event, action] of Object.entries(eventActions)) {
      if (msg.type === event) {
        action(msg.payload);
        break;
      }
    }
  });
};
