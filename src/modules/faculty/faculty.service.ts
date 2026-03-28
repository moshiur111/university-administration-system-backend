import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Days, TDays } from '../offeredCourse/offeredCourse.constant';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { hasTimeConflict } from '../offeredCourse/offeredCourse.utils';
import { USER_ROLES } from '../users/user.constant';
import { IUser } from '../users/user.interface';
import { User } from '../users/user.model';
import { FacultySearchableFields } from './faculty.constant';
import { IFaculty, TFacultyQuery } from './faculty.interface';
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
      email: payload.email,
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

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(Faculty.find(), query)
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;
  const meta = await facultyQuery.countTotal();

  return { meta, result };
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
    runValidators: true,
  }).populate('user');

  if (!updatedFaculty) {
    throw new AppError(404, 'Faculty not found');
  }

  return updatedFaculty;
};

const getEligibleFacultiesFromDB = async (query: TFacultyQuery) => {
  const { days, startTime, endTime, semesterRegistration } = query;

  // Normalize days
  const normalizedDays: TDays[] = Array.isArray(days)
    ? days.filter((d): d is TDays => Days.includes(d as TDays))
    : days && Days.includes(days as TDays)
      ? [days as TDays]
      : [];

  let baseQuery = Faculty.find({
    isDeleted: { $ne: true },
  });

  // Availability filtering (hide busy faculty)
  if (normalizedDays.length && startTime && endTime && semesterRegistration) {
    const assignedSchedules = await OfferedCourse.find({
      semesterRegistration,
      days: { $in: normalizedDays },
    }).select('faculty days startTime endTime');

    const busyFacultyIds = assignedSchedules
      .filter((schedule) =>
        hasTimeConflict([schedule], {
          days: normalizedDays,
          startTime: startTime as string,
          endTime: endTime as string,
        }),
      )
      .map((schedule) => schedule.faculty.toString());

    baseQuery = Faculty.find({
      isDeleted: { $ne: true },
      _id: { $nin: busyFacultyIds },
    });
  }

  // QueryBuilder
  const facultyQuery = new QueryBuilder(baseQuery, query)
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery.select(
    'name designation academicDepartment',
  );

  const meta = await facultyQuery.countTotal();

  return { meta, result };
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
  getEligibleFacultiesFromDB,
  deleteFacultyFromDB,
};
