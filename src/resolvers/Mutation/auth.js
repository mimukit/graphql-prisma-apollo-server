const { AuthenticationError } = require('apollo-server-express');

const AuthService = require('../../services/AuthService');

const AuthMutations = {
  register: async (parent, { name, email, password }, ctx, info) => {
    const hashPassword = await AuthService.getHashPassword(password);

    const newUserData = {
      name,
      email: email.toLowerCase(),
      password: hashPassword,
    };

    const newUser = await ctx.prisma.createUser({
      ...newUserData,
      roles: {
        set: ['USER'],
      },
    });

    return {
      token: AuthService.getToken({ userId: newUser.id }),
      newUser,
    };
  },

  login: async (parent, { email, password }, ctx, info) => {
    const user = await ctx.prisma.user({ email });

    if (!user) {
      throw new AuthenticationError(`No such user found for email: ${email}`);
    }

    const valid = await AuthService.checkPassword(password, user.password);

    if (!valid) {
      throw new AuthenticationError('Invalid password');
    }

    return {
      token: AuthService.getToken({ userId: user.id }),
      user,
    };
  },
};

module.exports = { AuthMutations };
