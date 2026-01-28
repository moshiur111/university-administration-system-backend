import { AcademicSemester } from './academicSemester.model';
import {
  ACADEMIC_SEMESTER_CODES,
  SEMESTER_MONTH_RANGE,
} from './academicSemester.constant';
import { IAcademicSemester } from './academicSemester.interface';
import AppError from '../../errors/AppError';

const createAcademicSemesterIntoDB = async (
  payload: Omit<IAcademicSemester, 'code' | 'isDeleted'>,
) => {
  const code = `${payload.year}-${ACADEMIC_SEMESTER_CODES[payload.name]}`;

  return await AcademicSemester.create({
    ...payload,
    code,
  });
};

const updateAcademicSemesterIntoDB = async (
  id: string,
  payload: Partial<IAcademicSemester>,
) => {
  const existing = await AcademicSemester.findById(id);

  if (!existing) {
    throw new AppError(404, 'Academic semester not found');
  }

  return await AcademicSemester.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

const getAllAcademicSemestersFromDB = async () => {
  return await AcademicSemester.find();
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  return await AcademicSemester.findById(id);
};

const deleteAcademicSemesterFromDB = async (id: string) => {
  return await AcademicSemester.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
};

/* Utility for other modules (Student, Enrollment, etc.) */
const getSemesterMonthRange = (name: string) => {
  return SEMESTER_MONTH_RANGE[name as keyof typeof SEMESTER_MONTH_RANGE];
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleAcademicSemesterFromDB,
  updateAcademicSemesterIntoDB,
  deleteAcademicSemesterFromDB,
  getSemesterMonthRange,
};
