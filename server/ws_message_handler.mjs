import actions from '../shared/events.json';
import {
  insertIdea,
  deleteIdea,
  getIdea,
  likeIdea,
  ideaLiked,
  dislikeIdea,
} from './model';

export const ws_message_handler = (socket, io) => {
  const guestHash = socket.request.session.id;
  const eventActions = {
    [actions.IDEA_CREATE_C]: (msg) => {
      const colId = msg.newTextColId;
      const text = msg.newTextContent;

      const { lastInsertRowid } = insertIdea({
        text: text,
        guest_hash: guestHash,
        col_id: colId,
      })

      io.emit(actions.IDEA_CREATE_S, {
        id: lastInsertRowid,
        text: text,
        col_id: colId,
        guest_hash: guestHash,
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
    [actions.IDEA_LIKE_C]: (msg) => {
      const { ideaId } = msg;

      const isLiked = ideaLiked(ideaId, guestHash);

      if (isLiked) {
        dislikeIdea(ideaId, guestHash);
      } else {
        likeIdea(ideaId, guestHash);
      }

      io.emit(actions.IDEA_LIKE_S, {
        ideaId,
      })
    },
    'disconnect': () => console.log(`user ${guestHash} disconnected`),
  };

  for (const [event, action] of Object.entries(eventActions)) {
    socket.on(event, action);
  }
};
