import logger from "@loggers/index";
import Sequelize from "sequelize";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { PubSub, withFilter } from "graphql-subscriptions";
import { IUtils } from "@interfaces/database";
import { IContext } from "@interfaces/request";
import { UserModel } from "@interfaces/models/User";
import { UserInput } from "@interfaces/input";
const pubsub = new PubSub();

const Op = Sequelize.Op;
const { JWT_SECRET } = process.env;

export default function resolver(this: IUtils) {
  const { db } = this;
  const { User } = db.models;

  const resolvers = {
    RootQuery: {
      getUser(
        _root: any,
        { id }: { id: number },
        _context: IContext
      ): Promise<UserModel | null> {
        return User.findOne({
          where: {
            id: id,
          },
        });
      },
      currentUser(_root: any, _args: any, context: IContext) {
        return User.findByPk(context.user.id);
      },
    },
    RootMutation: {
      addUser(_root: any, { user }: { user: UserInput }, context: IContext) {
        return User.findAll({
          where: {
            [Op.or]: [{ email: user.email }, { username: user.username }],
          },
          raw: true,
        }).then(async (users) => {
          if (users.length) {
            throw new Error("User already exists");
          } else {
            return bcrypt.hash(user.password, 10).then((hash) => {
              return User.create({
                email: user.email,
                password: hash,
                username: user.username,
              }).then((newUser) => {
                if (JWT_SECRET) {
                  const token = JWT.sign(
                    { email: user.email, id: newUser.id },
                    JWT_SECRET,
                    {
                      expiresIn: "1d",
                    }
                  );
                  const cookieExpiration = 1;
                  var expirationDate = new Date();
                  expirationDate.setDate(
                    expirationDate.getDate() + cookieExpiration
                  );
                  context.cookies.set("authorization", token, {
                    signed: true,
                    expires: expirationDate,
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                  });

                  return {
                    token,
                  };
                } else {
                  return "";
                }
              });
            });
          }
        });
      },
    },
    RootSubscription: {},
  };

  return resolvers;
}
