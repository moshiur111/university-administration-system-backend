import { Model } from "mongoose";
import { UserRoles, UserStatus } from "./user.constant";

export interface IUser {
  id: string;
  email: string;
  password: string;
  role: UserRoles;
  needsPasswordChange?: boolean;
  passwordChangedAt?: Date;
  status: UserStatus;
  isDeleted: boolean;
}

export interface UserModel extends Model<IUser> {
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
