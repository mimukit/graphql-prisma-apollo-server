const NoteSub = {
  noteSubscription: {
    subscribe: (parent, args, ctx, info) => ctx.db.notes,
  },
};

module.exports = { NoteSub };
