import { IDatabase } from "@interfaces/database";
import { Sequelize } from "sequelize";
import models from "../models";

const env = process.env.NODE_ENV || "development";
const config = require("../configs/database.json")[env];

const sequelize = new Sequelize({
  host: config.host,
  username: config.username,
  password: config.password,
  database: config.database,
  port: config.port,
  dialect: config.dialect,
  pool: config.pool,
});

const db: IDatabase = {
  sequelize: sequelize,
  models: models(sequelize),
};

export default db;
