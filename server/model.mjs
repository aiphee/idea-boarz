import betterSqlite from 'better-sqlite3';

const db = betterSqlite(
'db.sqlite',
{ /*verbose: console.log*/ }
);

const insertIdea = (data) => {
  const stmt = db.prepare('INSERT INTO idea (text, guest_hash, col_id) VALUES (@text, @guest_hash, @col_id)');
  return stmt.run(data);
};

const deleteIdea = (ideaId) => {
  const stmt = db.prepare('DELETE FROM idea WHERE idea.id=@ideaId');
  return stmt.run({ ideaId });
};

const getIdea = (ideaId) => {
  const stmt = db.prepare('SELECT * FROM idea WHERE idea.id=@ideaId');
  return stmt.get({ ideaId });
};


const likeIdea = (ideaId, guestHash) => {
  const stmt = db.prepare(`
    INSERT INTO idea_likes 
     (idea_id, guest_hash) 
     VALUES 
     (@ideaId, @guestHash)
  `);
  return stmt.run({ ideaId, guestHash });
};


const dislikeIdea = (ideaId, guestHash) => {
  const stmt = db.prepare(`
    DELETE FROM idea_likes 
     WHERE idea_id=@ideaId AND guest_hash LIKE @guestHash
  `);

  return stmt.run({ ideaId, guestHash });
};

const getColumnIdeas = () => {
  const col_stmt = db.prepare('SELECT * FROM main.col');
  const cols_ideas = {};

  const idea_stmt = db.prepare('SELECT * FROM idea WHERE col_id = ?');
  const likes_stmt = db.prepare('SELECT COUNT(*) FROM idea_likes WHERE idea_id = ?');

  for (const col of col_stmt.iterate()) {
    const col_ideas = {};
    for (const idea of idea_stmt.iterate(col.id)) {
      col_ideas[idea.id] = {
        ...idea,
        likes: likes_stmt.pluck().get(idea.id)
      };
    }

    cols_ideas[col.id] = {
      id: col.id,
      name: col.name,
      ideas: col_ideas
    };
  }
  return cols_ideas;
};

const getColumnId = (colName) => {
  const stmt = db.prepare('SELECT id FROM col WHERE name LIKE ?');
  return stmt.pluck().get(colName);
};

const getUserLikes = (guestHash) => {
  const stmt = db.prepare('SELECT idea_id FROM idea_likes WHERE guest_hash LIKE @guestHash');
  return stmt.pluck().all({ guestHash });
};

const ideaLiked = (ideaId, guestHash) => {
  const stmt = db.prepare('SELECT COUNT(*) FROM idea_likes WHERE idea_id=@ideaId AND guest_hash LIKE @guestHash');
  return !!stmt.pluck().get({ ideaId, guestHash });
};

export {
  getColumnIdeas,
  getColumnId,
  insertIdea,
  deleteIdea,
  getIdea,
  likeIdea,
  dislikeIdea,
  getUserLikes,
  ideaLiked,
};