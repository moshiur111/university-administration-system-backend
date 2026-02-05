import mongoose from 'mongoose';
import { IStudent } from './student.interface';
import { User } from '../users/user.model';
import { IUser } from '../users/user.interface';
import config from '../../config';
import { USER_ROLES } from '../users/user.constant';
import { generateStudentId } from './student.utils';
import AppError from '../../errors/AppError';
import { Student } from './student.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

const createStudentIntoDB = async (password: string, payload: IStudent) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find academic semester
    const academicSemester = await AcademicSemester.findById(
      payload.admissionSemester,
    ).session(session);

    if (!academicSemester) {
      throw new AppError(400, 'Invalid academic semester');
    }

    // Find acdemic department
    const academicDepartment = await AcademicDepartment.findById(
      payload.academicDepartment,
    ).session(session);

    if (!academicDepartment) {
      throw new AppError(400, 'Invalid academic department');
    }

    // Derived to avoid client-side inconsistency
    payload.academicFaculty = academicDepartment.academicFaculty;

    const userData: Partial<IUser> = {
      password: password || config.default_password,
      role: USER_ROLES.STUDENT,
      id: await generateStudentId(academicSemester),
      email: payload.email,
    };

    // Create user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // Create student
    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(400, 'Failed to create student');
    }

    await session.commitTransaction();
    return newStudent[0];
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const getAllStudentsFromDB = async () => {
  const result = await Student.find({ isDeleted: false }).populate('user');
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id).populate('user');

  if (!result) {
    throw new AppError(404, 'Student not found');
  }

  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<IStudent>) => {
  const result = await Student.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate('user');

  if (!result) {
    throw new AppError(404, 'Student not found');
  }

  return result;
};

const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(404, 'Student not found');
    }

    const userId = deletedStudent.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(404, 'User not found');
    }

    await session.commitTransaction();
    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

export const StudentServices = {
  createStudentIntoDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
