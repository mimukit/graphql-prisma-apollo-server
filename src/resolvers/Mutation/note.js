const { AuthenticationError } = require('apollo-server-express');

const NoteMutations = {
  createNote: (parent, { title, text }, ctx, info) => {
    if (!ctx.user.id) {
      throw new AuthenticationError('No logged in user');
    }
    const newNote = ctx.prisma.createNote({
      title,
      text,
      author: {
        connect: { id: ctx.user.id },
      },
    });

    return newNote;
  },

  deleteNote: (parent, args, ctx, info) =>
    ctx.prisma.deleteNote({ id: args.id }),
};

module.exports = { NoteMutations };
