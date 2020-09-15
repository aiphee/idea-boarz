import actions from '../shared/events.json';
import {insertIdea, deleteIdea, getIdea} from './model';

export const ws_message_handler = (socket, io) => {
  const userHash = socket.request.session.id;
  const eventActions = {
    [actions.IDEA_CREATE_C]: (msg) => {
      const colId = msg.newTextColId;
      const text = msg.newTextContent;

      const { lastInsertRowid } = insertIdea({
        text: text,
        guest_hash: userHash,
        col_id: colId,
      })

      io.emit(actions.IDEA_CREATE_S, {
        id: lastInsertRowid,
        text: text,
        col_id: colId,
        guest_hash: userHash,
        likes: 0,
        deleted: 0,
      })
    },
    [actions.IDEA_DELETE_C]: (msg) => {
      const { ideaId } = msg;

      const idea = getIdea(ideaId);
      const result = deleteIdea(ideaId);

      io.emit(actions.IDEA_DELETE_S, {
        ideaId,
        colId: idea.col_id,
        deleteResult: result,
      })
    },
    'disconnect': () => console.log(`user ${userHash} disconnected`),
  };

  for (const [event, action] of Object.entries(eventActions)) {
    socket.on(event, action);
  }
};
