import { AuthenticationError } from "apollo-server-express";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver, GraphQLField } from "graphql";

class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field: GraphQLField<any, any>) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function (...args) {
      const ctx = args[2];
      if (ctx.user) {
        return await resolve.apply(this, args);
      } else {
        throw new AuthenticationError("You need to be logged in.");
      }
    };
  }
}

export default AuthDirective;
