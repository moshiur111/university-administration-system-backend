import { NextFunction, Request, Response } from 'express';
import { UserRoles } from '../modules/users/user.constant';
import AppError from '../errors/AppError';

const authorize = (...allowedRoles: UserRoles[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      throw new AppError(401, 'Unauthorized access');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new AppError(403, 'You are not allowed to access this resource');
    }

    next();
  };
};

export default authorize;
