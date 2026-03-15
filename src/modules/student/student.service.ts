import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { USER_ROLES } from '../users/user.constant';
import { IUser } from '../users/user.interface';
import { User } from '../users/user.model';
import { studentSearchableFields } from './student.constant';
import { IStudent } from './student.interface';
import { Student } from './student.model';
import { generateStudentId } from './student.utils';

const createStudentIntoDB = async (
  file: Express.Multer.File | undefined,
  password: string,
  payload: IStudent,
) => {
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

    // Derive faculty from department
    payload.academicFaculty = academicDepartment.academicFaculty;

    const userData: Partial<IUser> = {
      password: password || config.default_password,
      role: USER_ROLES.STUDENT,
      id: await generateStudentId(academicSemester),
      email: payload.email,
    };

    // Upload image if file exists
    let profileImg = '';

    if (file?.path) {
      const imageName = `${userData.id}${payload.name.firstName}`;
      const { secure_url } = await sendImageToCloudinary(imageName, file.path);
      profileImg = secure_url;
    }

    // Create user
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(400, 'Failed to create user');
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    payload.profileImg = profileImg;

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

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('admissionSemester')
      .populate('academicDepartment')
      .populate('academicFaculty'),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.countTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };
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
