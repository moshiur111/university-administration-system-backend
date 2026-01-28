import { ACADEMIC_SEMESTER_CODES } from './academicSemester.constant';

export type TAcademicSemesterName =
  keyof typeof ACADEMIC_SEMESTER_CODES;

export interface IAcademicSemester {
  name: TAcademicSemesterName;
  year: number;
  code: string;
  isDeleted: boolean;
}
