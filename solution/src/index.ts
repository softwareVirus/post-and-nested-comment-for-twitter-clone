import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadSchema } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import path from "path";
import dotenv from "dotenv";
import resolvers from "./resolvers";
dotenv.config();
console.log(process.env.MONGO_CONNECTION);
async function main() {
  console.log(__dirname)
  const schema = await loadSchema(path.join(__dirname, "./schema.graphql"), {
    loaders: [new GraphQLFileLoader()],
  });

  // Write some resolvers
  

  // Add resolvers to the schema
  const schemaWithResolvers = addResolversToSchema({ schema, resolvers });

  const server = new ApolloServer({
    schema: schemaWithResolvers,
  });

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀  Server ready at: ${url}`);
}
main();
