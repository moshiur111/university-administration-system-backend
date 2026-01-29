import { IAcademicSemester } from '../academicSemester/academicSemester.interface';
import { Student } from './student.model';

const findLastStudentId = async (
  currentYear: string,
  currentSemesterCode: string,
) => {
  const lastStudent = await Student.findOne(
    { id: new RegExp(`^${currentYear}${currentSemesterCode}`) },
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id;
};

export const generateStudentId = async (payload: IAcademicSemester) => {
  let currentId = '0';

  const lastStudentId = await findLastStudentId(
    payload.year.toString(),
    payload.code,
  );

  const lastStudentYear = lastStudentId?.substring(0, 4);
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);

  const currentYear = payload.year.toString();
  const currentSemesterCode = payload.code;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  return `${currentYear}${currentSemesterCode}${incrementId}`;
};
