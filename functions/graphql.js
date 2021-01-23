const { ApolloServer, gql } = require("apollo-server-lambda");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: (root, args, context) => {
      return "Hello, world!";
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  //playground enables you to navigate to localhost:9000 in the browser
  playground: true
});

exports.handler = server.createHandler({
    cors: {
        origin: '*',
        credentials: true
    }
});