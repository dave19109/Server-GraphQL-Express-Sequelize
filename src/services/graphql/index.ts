import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import Resolvers from "./resolvers";
import Schema from "./schema";
import auth from "./auth";
import JWT from "jsonwebtoken";
import { IUtils } from "@interfaces/database";

const { JWT_SECRET } = process.env;

export default (utils: IUtils) => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils),
    schemaDirectives: {
      auth: auth,
    },
  });

  const server = new ApolloServer({
    schema: executableSchema,
    /*engine: {
      apiKey: "YOUR_KEY",
      generateClientInfo: ({ request }) => {
        const headers = request?.http?.headers;
        const clientName = headers?.get("apollo-client-name");
        const clientVersion = headers?.get("apollo-client-version");

        if (clientName && clientVersion) {
          return {
            clientName,
            clientVersion,
          };
        } else {
          return {
            clientName: "Unknown Client",
            clientVersion: "Unversioned",
          };
        }
      },
    },*/
    cacheControl: {
      defaultMaxAge: 5,
      stripFormattedExtensions: false,
      calculateHttpHeaders: true,
    },
    context: async ({ req }) => {
      const authorization = req.headers.authorization;
      if (typeof authorization !== typeof undefined) {
        var search = "Bearer";
        var regEx = new RegExp(search, "ig");
        const token = authorization?.replace(regEx, "").trim();
        if (token && JWT_SECRET) {
          return JWT.verify(
            token,
            JWT_SECRET,
            function (err: any, result: any) {
              if (err) {
                return req;
              } else {
                return utils.db.models.User.findByPk(result.id).then(
                  (user: any) => {
                    return Object.assign({}, req, { user });
                  }
                );
              }
            }
          );
        }
      } else {
        return req;
      }
    },
  });

  return server;
};
