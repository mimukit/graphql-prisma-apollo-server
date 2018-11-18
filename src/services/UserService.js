const { prisma } = require('../prisma/generated/prisma-client');

const getUser = async userId => {
  const user = await prisma.user({ id: userId });

  if (!user) {
    return {};
  }

  return user;
};

module.exports = {
  getUser,
};
