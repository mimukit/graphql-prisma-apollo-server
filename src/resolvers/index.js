const { User, UserQuries } = require('./Query/user');
const { Note, NoteQuries } = require('./Query/note');

const { AuthMutations } = require('./Mutation/auth');
const { NoteMutations } = require('./Mutation/note');

const { NoteSub } = require('./Subscription/note');

module.exports = {
  Query: {
    ...UserQuries,
    ...NoteQuries,
  },
  Mutation: {
    ...AuthMutations,
    ...NoteMutations,
  },
  Subscription: {
    ...NoteSub,
  },
  User,
  Note,
};
