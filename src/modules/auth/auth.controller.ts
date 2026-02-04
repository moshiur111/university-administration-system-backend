import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
    // sameSite: 'none',
    // maxAge: 1000 * 60 * 60 * 24 * 365,
  });

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body;
  const result = await AuthServices.changePassword(req.user, passwordData);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Password changed successfully',
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Access token retrieved successfully',
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
};
