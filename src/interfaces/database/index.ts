import { UserStatic } from "@interfaces/models/User";
import { Sequelize } from "sequelize/types";

export type IUtils = {
  db: IDatabase;
};

export type IDatabase = {
  sequelize: Sequelize;
  models: {
    User: UserStatic;
  };
};
