require('dotenv').config();
const path = require('path');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { importSchema } = require('graphql-import');

const { prisma } = require('./prisma/generated/prisma-client');
const resolvers = require('./resolvers');
const { IsAuthDirective, HasRoleDirective } = require('./directives');

const AuthService = require('./services/AuthService');
const { getUser } = require('./services/UserService');

const app = express();

const typeDefs = importSchema(path.join(__dirname, 'schema.graphql'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    isAuth: IsAuthDirective,
    hasRole: HasRoleDirective,
  },
  context: async ({ req }) => {
    let user = {};

    const userId = AuthService.getUserId(req);

    if (userId) {
      user = await getUser(userId);
    }

    return { user, prisma };
  },
});

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
  },
});

app.listen({ port: process.env.PORT }, () =>
  process.env.NODE_ENV === 'production'
    ? console.log('Server started')
    : console.log(
        `Server started at http://localhost:${process.env.PORT}/graphql`,
      ),
);
