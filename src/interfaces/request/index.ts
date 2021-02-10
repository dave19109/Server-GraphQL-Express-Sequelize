import { UserModel } from "@interfaces/models/User";
import Cookies from "cookies";
export interface IContext extends Request {
  user: UserModel;
  cookies: Cookies;
}
