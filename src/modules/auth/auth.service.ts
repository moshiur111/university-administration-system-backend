import config from '../../config';
import AppError from '../../errors/AppError';
import { User } from '../users/user.model';
import { TLoginUser } from './auth.interface';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // Check if the user is exist
  const user = await User.isUserExistsByCustomId(payload?.id);
  if (!user) {
    throw new AppError(404, 'This user is not found');
  }

  // Check if the user is already deleted
  if (await User.isUserDeleted(payload?.id)) {
    throw new AppError(403, 'This user is deleted');
  }

  // Check if the user is blocked
  if (await User.userStatus(payload?.id)) {
    throw new AppError(403, 'This user is blocked');
  }

  //   Check if the password is correct
  if (!(await User.isPasswordMatched(payload?.password, user.password))) {
    throw new AppError(403, 'This password is not matched');
  }

  // Create token and send to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwtAccessSecret,
    config.jwtAccessExpiresIn,
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUser,
};
