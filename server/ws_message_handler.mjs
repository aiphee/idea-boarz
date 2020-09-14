import actions from '../shared/events.json';
import { insertIdea } from './model';

export const ws_message_handler = (socket, io) => {
  const eventActions = {
    [actions.IDEA_CREATE_C]: (msg) => {
      const colId = msg.newTextColId;
      const text = msg.newTextContent;

      const { lastInsertRowid } = insertIdea({
        text: text,
        guest_hash: '1ff',
        col_id: colId,
      })

      io.emit(actions.IDEA_CREATE_S, {
        id: lastInsertRowid,
        text: text,
        col_id: colId,
        guest_hash: '1ff',
        likes: 0,
        deleted: 0,
      })
    },
    'disconnect': () => console.log('user disconnected'),
  };

  for (const [event, action] of Object.entries(eventActions)) {
    socket.on(event, action);
  }
};
