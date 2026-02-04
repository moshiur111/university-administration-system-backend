import mongoose from 'mongoose';
import { AdminType } from './admin.constant';
import { Admin } from './admin.model';
import { User } from '../users/user.model';
import config from '../../config';
import { USER_ROLES } from '../users/user.constant';

const seedSuperAdmin = async (): Promise<void> => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const isSuperAdminExists = await Admin.findOne(
        { adminType: AdminType.SUPER_ADMIN },
        null,
        { session },
      );

      if (isSuperAdminExists) {
        return;
      }

      const user = new User({
        id: config.super_admin_id,
        email: config.super_admin_email,
        password: config.super_admin_password,
        role: USER_ROLES.ADMIN,
        needsPasswordChange: false,
      });

      await user.save({ session });

      const admin = new Admin({
        id: config.super_admin_id,
        user: user._id,
        designation: 'Super Admin',
        name: {
          firstName: 'Super',
          lastName: 'Admin',
        },
        gender: 'male',
        email: config.super_admin_email,
        contactNo: '0000000000',
        emergencyContactNo: '0000000000',
        presentAddress: 'System Generated',
        permanentAddress: 'System Generated',
        adminType: AdminType.SUPER_ADMIN,
        isDeleted: false,
      });

      await admin.save({ session });
    });
  } finally {
    session.endSession();
  }
};

export default seedSuperAdmin;
