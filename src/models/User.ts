import { Sequelize, DataTypes } from "sequelize";
import { IUser, UserStatic } from "@interfaces/models/User";
import { SequelizeAttributes } from "@interfaces/sequelizeAttributes";

module.exports = (sequelize: Sequelize) => {
  const attributes: SequelizeAttributes<IUser> = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  };

  const User: any = <UserStatic>sequelize.define("User", attributes);

  User.associate = (models: any) => {
    //ex: User.belongsTo(models.Post)
  };
  return User;
};
