import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { IOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import { hasTimeConflict } from './offeredCourse.utils';

const createOfferedCourseIntoDB = async (payload: IOfferedCourse) => {
  const {
    semesterRegistration,
    academicDepartment,
    course,
    faculty,
    days,
    startTime,
    endTime,
    section,
  } = payload;

  // Semester check
  const isSemesterRegistrationExist =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExist) {
    throw new AppError(404, 'Semester Registration not found');
  }

  const academicSemester = isSemesterRegistrationExist.academicSemester;

  // Course check
  const isCourseExist = await Course.findById(course);
  if (!isCourseExist) {
    throw new AppError(404, 'Course not found');
  }

  // Faculty check
  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError(404, 'Faculty not found');
  }

  // Department check
  const isDepartmentExist =
    await AcademicDepartment.findById(academicDepartment);
  if (!isDepartmentExist) {
    throw new AppError(404, 'Department not found');
  }

  // Faculty belongs to department
  if (
    isFacultyExist.academicDepartment.toString() !==
    academicDepartment.toString()
  ) {
    throw new AppError(400, 'Faculty does not belong to this department');
  }

  // Prevent duplicate section
  const isDuplicate = await OfferedCourse.findOne({
    semesterRegistration,
    course,
    section,
  });

  if (isDuplicate) {
    throw new AppError(
      400,
      'This course section already exists in this semester',
    );
  }

  // Schedule conflict check
  const normalizedDays = Array.isArray(days) ? days : [days];

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: normalizedDays },
  }).select('days startTime endTime');

  const newSchedule = {
    days: normalizedDays,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(400, 'Faculty is not available at this time');
  }

  // Create Offered Course
  const result = await OfferedCourse.create({
    ...payload,
    academicSemester,
  });

  return result;
};

const getAllOfferedCoursesFromDB = async () => {
  const result = await OfferedCourse.find({});
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id);
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Partial<IOfferedCourse>,
) => {
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB,
};
