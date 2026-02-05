import mongoose from 'mongoose';
import config from '../../config';
import { IUser } from '../users/user.interface';
import { IAdmin } from './admin.interface';
import { generateAdminId } from './admin.utils';
import { User } from '../users/user.model';
import AppError from '../../errors/AppError';
import { Admin } from './admin.model';
import { USER_ROLES } from '../users/user.constant';

const createAdminIntoDB = async (password: string, payload: IAdmin) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userData: Partial<IUser> = {
      password: password || config.default_password,
      role: USER_ROLES.ADMIN,
      id: await generateAdminId(),
      email: payload.email,
    };

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Failed to create admin user');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(400, 'Failed to create admin Profile');
    }

    await session.commitTransaction();
    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const getAllAdminsFromDB = async () => {
  return Admin.find({ isDeleted: false }).populate('user');
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id).populate('user');

  if (!result) {
    throw new AppError(404, 'Admin not found');
  }

  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<IAdmin>) => {
  const result = await Admin.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(404, 'Admin not found');
  }

  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const admin = await Admin.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!admin) {
    throw new AppError(404, 'Admin not found');
  }

  return admin;
};

export const AdminServices = {
  createAdminIntoDB,
  getAllAdminsFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
};
