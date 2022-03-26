const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");
const { MONGODB } = require("./config.js");
const colors = require("colors");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers"); //since it's in 'index' we need not specify

// server instance: apollo uses express server only internally
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }), //to check whether the user is authenticated
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(MONGODB, { useNewUrlParser: true })
  .then(res => {
    console.log(`MongoDB Connected:${res.connection.host}`.bgMagenta.bold);
    return server.listen({ port: PORT });
  })
  .then(res => {
    console.log(`Server running on ${res.url}`.brightBlue.underline);
  })
  .catch(err => {
    console.log("Error in mongoose connect" + err);
  });
