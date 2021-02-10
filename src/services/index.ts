import { IUtils } from "@interfaces/database";
import graphql from "./graphql";
import subscriptions from "./subscriptions";

export default (utils: IUtils) => ({
  graphql: graphql(utils),
  subscriptions: subscriptions(utils),
});
