import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { User } from '../modules/users/user.model';
import catchAsync from '../utils/catchAsync';

const auth = () => {
  return catchAsync(
    async (req: Request, _res: Response, next: NextFunction) => {
      const authorizationHeader = req.headers.authorization;

      if (!authorizationHeader) {
        throw new AppError(401, 'You are not authorized');
      }

      if (!authorizationHeader.startsWith('Bearer ')) {
        throw new AppError(401, 'Invalid token format');
      }

      const token = authorizationHeader.split(' ')[1]?.trim();

      if (!token) {
        throw new AppError(401, 'Invalid token');
      }

      let decoded: JwtPayload;

      try {
        decoded = jwt.verify(token, config.jwt_access_secret) as JwtPayload;
      } catch {
        throw new AppError(401, 'You are not authorized');
      }

      const { userId } = decoded;

      if (!userId) {
        throw new AppError(401, 'Invalid token payload');
      }

      const user = await User.isUserExistsByCustomId(userId);

      if (!user) {
        throw new AppError(404, 'User is not found');
      }

      if (user.isDeleted) {
        throw new AppError(403, 'User is deleted');
      }

      if (user.status === 'blocked') {
        throw new AppError(403, 'User is blocked');
      }

      req.user = decoded;

      next();
    },
  );
};

export default auth;
