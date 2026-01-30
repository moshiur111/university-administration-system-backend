import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TCreateSemesterRegistrationPayload } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import { SEMESTER_REGISTRATION_STATUS } from './semesterRegistration.constant';

const createSemesterRegistrationIntoDB = async (
  payload: TCreateSemesterRegistrationPayload,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Check academicSemester exists
    const academicSemester = await AcademicSemester.findById(
      payload.academicSemester,
    );

    if (!academicSemester) {
      throw new AppError(404, 'Academic semester not found');
    }

    // Ensure one registration per semester
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
      {
        session,
      },
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

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
};
