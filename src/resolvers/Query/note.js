const Note = {
  author: (parent, args, ctx, info) =>
    ctx.prisma.note({ id: parent.id }).author(),
};

const NoteQuries = {
  notes: (parent, args, ctx, info) => ctx.prisma.notes(),
};

module.exports = {
  Note,
  NoteQuries,
};
