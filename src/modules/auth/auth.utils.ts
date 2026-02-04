import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';
import { UserRoles } from '../users/user.constant';

export const createToken = (
  jwtPayload: { userId: string; role: UserRoles },
  secret: Secret,
  expiresIn: SignOptions['expiresIn'],
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
