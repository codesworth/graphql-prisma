import { GraphQLServer, PubSub } from "graphql-yoga";
import prisma from "./prisma";
import db from "./db";
import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import Subscription from "./resolvers/Subscription";
//type Definitions :: Applcation Schema

//Dummy user Array

//Scaler Types: String, Boolean, Int, Float, ID

const pubsub = new PubSub();

//Resolvers:: Set of FUnctions for each action
const resolvers = {
  Query,
  Mutation,
  User,
  Post,
  Comment,
  Subscription
};

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
  }
});
server.start(() => {
  console.log("GraphQL Server is Live");
});
