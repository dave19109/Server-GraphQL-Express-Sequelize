import { Model, BuildOptions } from "sequelize";

export interface IUser {
  id?: number;
  email: string;
  password: string;
  avatar?: string;
  username: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<IUser> {
  id: number;
  email: string;
  password: string;
  avatar: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Model<IUser, UserModel> {}

export type UserStatic = typeof User & {
  new (values?: object, options?: BuildOptions): UserModel;
};
