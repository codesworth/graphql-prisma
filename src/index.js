import { GraphQLServer, PubSub } from "graphql-yoga";
import prisma from "./prisma";
import db from "./db";
import { resolvers, fragmentReplacements } from "./resolvers/index";

//type Definitions :: Applcation Schema

//Dummy user Array

//Scaler Types: String, Boolean, Int, Float, ID

const pubsub = new PubSub();

//Resolvers:: Set of FUnctions for each action

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: resolvers,
  context(request) {
    return {
      db,
      pubsub,
      prisma,
      request
    };
  },
  fragmentReplacements
});
server.start(() => {
  console.log("GraphQL Server is Live");
});
