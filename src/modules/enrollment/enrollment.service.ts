import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { Student } from '../student/student.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Enrollment } from './enrollment.model';
import { IEnrollment, TCreateEnrollmentPayload } from './enrollment.interface';

const createEnrollmentIntoDB = async (payload: TCreateEnrollmentPayload) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const student = await Student.findById(payload.student).session(session);

    if (!student) {
      throw new AppError(404, 'Student not found');
    }

    const academicSemester = await AcademicSemester.findById(
      payload.academicSemester,
    ).session(session);

    if (!academicSemester) {
      throw new AppError(404, 'Academic Semester not found');
    }

    const academicDepartment = await AcademicDepartment.findById(
      payload.academicDepartment,
    ).session(session);

    if (!academicDepartment) {
      throw new AppError(404, 'Academic Department not found');
    }

    // Derived to avoid client-side inconsistency
    const academicFaculty = academicDepartment.academicFaculty;

    const enrollmentData: IEnrollment = {
      ...payload,
      academicFaculty,
      status: 'ACTIVE',
      isDeleted: false,
    };

    const newEnrollment = await Enrollment.create([enrollmentData], {
      session,
    });

    if (!newEnrollment.length) {
      throw new AppError(400, 'Failed to create enrollment');
    }

    await session.commitTransaction();
    return newEnrollment;
  } catch (error: any) {
    await session.abortTransaction();

    if (error?.code === 11000) {
      throw new AppError(400, 'Enrollment already exists');
    }

    throw error;
  } finally {
    session.endSession();
  }
};

export const EnrollmentServices = {
  createEnrollmentIntoDB,
};
