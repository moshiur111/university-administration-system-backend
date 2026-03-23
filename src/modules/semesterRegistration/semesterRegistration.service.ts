import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { SEMESTER_REGISTRATION_STATUS } from './semesterRegistration.constant';
import {
  ISemesterRegistration,
  TCreateSemesterRegistrationPayload,
} from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';

const createSemesterRegistrationIntoDB = async (
  payload: TCreateSemesterRegistrationPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const academicSemester = await AcademicSemester.findById(
      payload.academicSemester,
    );

    if (!academicSemester) {
      throw new AppError(404, 'Academic semester not found');
    }

    const existingRegistration = await SemesterRegistration.findOne({
      academicSemester: payload.academicSemester,
    });

    if (existingRegistration) {
      throw new AppError(
        400,
        'Semester registration already exists for this academic semester',
      );
    }

    const semesterRegistrationData = {
      ...payload,
      status: SEMESTER_REGISTRATION_STATUS.UPCOMING,
    };

    const result = await SemesterRegistration.create(
      [semesterRegistrationData],
      { session },
    );

    if (!result) {
      throw new AppError(400, 'Failed to create semester registration');
    }

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  const meta = await semesterRegistrationQuery.countTotal();

  return { meta, result };
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');

  if (!result) {
    throw new AppError(404, 'Semester registration not found');
  }

  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<ISemesterRegistration>,
) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'Semester registration not found');
  }

  const currentStatus = isSemesterRegistrationExists.status;
  const requestedStatus = payload.status;

  if (currentStatus === SEMESTER_REGISTRATION_STATUS.ENDED) {
    throw new AppError(400, 'Semester registration already ended');
  }

  if (
    currentStatus === SEMESTER_REGISTRATION_STATUS.UPCOMING &&
    requestedStatus === SEMESTER_REGISTRATION_STATUS.ENDED
  ) {
    throw new AppError(
      400,
      `Cannot change status from ${currentStatus} to ${requestedStatus}`,
    );
  }

  if (
    currentStatus === SEMESTER_REGISTRATION_STATUS.ONGOING &&
    requestedStatus === SEMESTER_REGISTRATION_STATUS.UPCOMING
  ) {
    throw new AppError(
      400,
      `Cannot change status from ${currentStatus} to ${requestedStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'Semester registration not found');
  }

  // Only UPCOMING registrations can be deleted
  if (
    isSemesterRegistrationExists.status !==
    SEMESTER_REGISTRATION_STATUS.UPCOMING
  ) {
    throw new AppError(
      400,
      `Cannot delete a semester registration that is ${isSemesterRegistrationExists.status}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
