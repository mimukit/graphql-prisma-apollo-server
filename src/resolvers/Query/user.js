const { AuthenticationError } = require('apollo-server-express');

const User = {
  notes: (parent, args, ctx, info) =>
    ctx.prisma.user({ id: parent.id }).notes(),
};

const UserQuries = {
  users: (parent, args, ctx, info) => ctx.prisma.users(),

  me: (parent, args, ctx, info) => {
    if (!ctx.user.id) {
      throw new AuthenticationError('No user logged in');
    }

    return ctx.prisma.user({ id: ctx.user.id });
  },
};

module.exports = {
  User,
  UserQuries,
};
