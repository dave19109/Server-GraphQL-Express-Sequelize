import { Sequelize } from "sequelize";

if (process.env.NODE_ENV === "development") {
  require("babel-plugin-require-context-hook/register")();
}
export default (sequelize: Sequelize) => {
  let db: any = {};

  const context = require.context(
    ".",
    true,
    /^\.\/(?!index\.ts).*\.ts$/,
    "sync"
  );
  context
    .keys()
    .map(context)
    .forEach((module: any) => {
      const model = module(sequelize, Sequelize);
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  return db;
};
