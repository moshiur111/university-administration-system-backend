import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { USER_ROLES } from '../users/user.constant';
import { IUser } from '../users/user.interface';
import { User } from '../users/user.model';
import { IFaculty } from './faculty.interface';
import { Faculty } from './faculty.model';
import { generateFacultyId } from './faculty.utils';

const createFacultyIntoDB = async (password: string, payload: IFaculty) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userData: Partial<IUser> = {
      password: password || config.default_password,
      role: USER_ROLES.FACULTY,
      id: await generateFacultyId(),
    };

    // Create user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user');
    }

    // Create faculty
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(400, 'Failed to create faculty');
    }

    await session.commitTransaction();

    return newFaculty[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const getAllFacultyFromDB = async () => {
  const faculties = await Faculty.find().populate('user');

  return faculties;
};

const getSingleFacultyFromDB = async (id: string) => {
  const faculty = await Faculty.findById(id).populate('user');

  if (!faculty) {
    throw new AppError(404, 'Faculty not found');
  }

  return faculty;
};

const updateFacultyIntoDB = async (id: string, payload: Partial<IFaculty>) => {
  const updatedFaculty = await Faculty.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('user');

  if (!updatedFaculty) {
    throw new AppError(404, 'Faculty not found');
  }

  return updatedFaculty;
};

const deleteFacultyFromDB = async (id: string) => {
  const deletedFaculty = await Faculty.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  ).populate('user');

  if (!deletedFaculty) {
    throw new AppError(404, 'Faculty not found');
  }

  return deletedFaculty;
};

export const FacultyServices = {
  createFacultyIntoDB,
  getAllFacultyFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
