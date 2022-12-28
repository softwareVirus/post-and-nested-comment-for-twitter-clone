"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const load_1 = require("@graphql-tools/load");
const graphql_file_loader_1 = require("@graphql-tools/graphql-file-loader");
const schema_1 = require("@graphql-tools/schema");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const resolvers_1 = __importDefault(require("./resolvers"));
dotenv_1.default.config();
console.log(process.env.MONGO_CONNECTION);
async function main() {
    console.log(__dirname);
    const schema = await (0, load_1.loadSchema)(path_1.default.join(__dirname, "./schema.graphql"), {
        loaders: [new graphql_file_loader_1.GraphQLFileLoader()],
    });
    // Write some resolvers
    // Add resolvers to the schema
    const schemaWithResolvers = (0, schema_1.addResolversToSchema)({ schema, resolvers: resolvers_1.default });
    const server = new server_1.ApolloServer({
        schema: schemaWithResolvers,
    });
    // Passing an ApolloServer instance to the `startStandaloneServer` function:
    //  1. creates an Express app
    //  2. installs your ApolloServer instance as middleware
    //  3. prepares your app to handle incoming requests
    const { url } = await (0, standalone_1.startStandaloneServer)(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
}
main();
