import AppError from '../errors/AppError';
import { AdminType } from '../modules/admin/admin.constant';
import { Admin } from '../modules/admin/admin.model';
import catchAsync from '../utils/catchAsync';

const requireSuperAdmin = catchAsync(async (req, res, next) => {
  const user = req.user;

  if (!user) {
    throw new AppError(401, 'You are not authorized');
  }

  const admin = await Admin.findOne({ id: user.userId });

  if (!admin) {
    throw new AppError(401, 'You are not authorized');
  }

  if (admin.adminType !== AdminType.SUPER_ADMIN) {
    throw new AppError(403, 'Only super admin can access this route');
  }

  next();
});

export default requireSuperAdmin;
