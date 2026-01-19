import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { User } from '../modules/users/user.model';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    // console.log('token: ', token);

    if (!token) {
      throw new AppError(401, 'You are not authorized');
    }

    const decode = jwt.verify(token, config.jwtAccessSecret) as JwtPayload;

    // console.log(decode);
    const { userId, _role, _iat } = decode;

    // Check if the user is exist
    const user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      throw new AppError(404, 'User is not found');
    }

    const isDeleted = user.isDeleted;
    if (isDeleted) {
      throw new AppError(403, 'User is deleted');
    }

    const userStatus = user.status;
    if (userStatus == 'blocked') {
      throw new AppError(403, 'User is blocked');
    }

    req.user = decode;

    next();
  });
};

export default auth;
