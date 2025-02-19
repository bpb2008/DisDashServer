import express from 'express';
import { ApolloServer } from "@apollo/server"; 
import { expressMiddleware } from "@apollo/server/express4";
import dotenv from 'dotenv';
import { typeDefs } from './graphql/schema';
import { resolvers } from "./graphql/resolvers";
import { db } from './db-connection';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const startServer = async () => {
  await server.start();

  app.use(cors()); 
  app.use(express.json()); 

  app.use(
    "/graphql", 
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        return { db, authHeader };
    },
  })
  );

  app.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}/graphql`);
  });
};

startServer();
