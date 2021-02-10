import { makeExecutableSchema } from "graphql-tools";
import Resolvers from "../graphql/resolvers";
import Schema from "../graphql/schema";
import auth from "../graphql/auth";
import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { IUtils } from "@interfaces/database";

export default (utils: IUtils) => (server: any) => {
  const executableSchema = makeExecutableSchema({
    typeDefs: Schema,
    resolvers: Resolvers.call(utils),
    schemaDirectives: {
      auth: auth,
    },
  });

  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: executableSchema,
      onConnect: async (params: any, socket: any) => {
        const authorization = params.authToken;
        if (typeof authorization !== typeof undefined) {
          var search = "Bearer";
          var regEx = new RegExp(search, "ig");
          const token = authorization.replace(regEx, "").trim();
          if (JWT_SECRET) {
            return jwt.verify(
              token,
              JWT_SECRET,
              function (err: any, result: any) {
                if (err) {
                  throw new Error("Missing auth token!");
                } else {
                  return utils.db.models.User.findById(result.id).then(
                    (user: any) => {
                      return Object.assign({}, socket.upgradeReq, { user });
                    }
                  );
                }
              }
            );
          }
        } else {
          throw new Error("Missing auth token!");
        }
      },
    },
    {
      server,
      path: "/subscriptions",
    }
  );
};
