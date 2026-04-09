require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const app = express();
const port = process.env.PORT || 4000;

app.use(cors({
  origin: "http://localhost:4200"
}));

connectDB();

async function startServer() {
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/graphql`);
  });
}

startServer();
