require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const connectDB = require("./config/db");
const typeDefs = require("./schema/typeDefs");
const resolvers = require("./schema/resolvers");

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = [
  "http://localhost:4200",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const isVercelOrigin = typeof origin === "string" && origin.endsWith(".vercel.app");

    if (!origin || allowedOrigins.includes(origin) || isVercelOrigin) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));

connectDB();

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    cache: "bounded",
  });
  await server.start();
  server.applyMiddleware({ app });

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/graphql`);
  });
}

startServer();
