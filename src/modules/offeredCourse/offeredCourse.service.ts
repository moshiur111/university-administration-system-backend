import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { Course } from '../course/course.model';
import { Faculty } from '../faculty/faculty.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Student } from '../student/student.model';
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

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(
    OfferedCourse.find().populate('course'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await offeredCourseQuery.modelQuery;
  const meta = await offeredCourseQuery.countTotal();

  return { meta, result };
};

const getStudentOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // Pagination
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  // Find student
  const student = await Student.findOne({ id: userId });

  if (!student) {
    throw new AppError(404, 'User not found');
  }

  // Find ongoing semester
  const currentSemester = await SemesterRegistration.findOne({
    status: 'ONGOING',
  });

  if (!currentSemester) {
    throw new AppError(404, 'No ongoing semester registration found');
  }

  // Aggregation pipeline
  const aggregationPipeline = [
    {
      $match: {
        semesterRegistration: currentSemester._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },

    // Enrolled courses (current semester)
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          semesterId: currentSemester._id,
          studentId: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$semesterRegistration', '$$semesterId'] },
                  { $eq: ['$student', '$$studentId'] },
                  { $eq: ['$isEnrolled', true] },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },

    // Completed courses
    {
      $lookup: {
        from: 'enrolledcourses',
        let: { studentId: student._id },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$student', '$$studentId'] },
                  { $eq: ['$isCompleted', true] },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },

    // Extract completed course IDs
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'c',
            in: '$$c.course',
          },
        },
      },
    },

    // Eligibility checks
    {
      $addFields: {
        isPreRequisitesFulFilled: {
          $or: [
            { $eq: ['$course.preRequisiteCourses', []] },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },
        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'e',
                in: '$$e.course',
              },
            },
          ],
        },
      },
    },

    // Final filter
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFulFilled: true,
      },
    },
  ];

  // Data query
  const result = await OfferedCourse.aggregate([
    ...aggregationPipeline,
    { $skip: skip },
    { $limit: limit },
  ]);

  // Count query
  const totalResult = await OfferedCourse.aggregate([
    ...aggregationPipeline,
    { $count: 'total' },
  ]);

  const total = totalResult[0]?.total || 0;
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

const getFacultyOfferedCoursesFromDB = async (
  facultyId: string,
  query: Record<string, unknown>,
) => {
  const status = query?.status as string;

  // Pagination
  const page = Number(query?.page) || 1;
  const limit = Number(query?.limit) || 10;
  const skip = (page - 1) * limit;

  // Find faculty
  const faculty = await Faculty.findOne({ id: facultyId });

  if (!faculty) {
    throw new AppError(404, 'Faculty not found');
  }

  const basePipeline: any[] = [
    {
      $match: {
        faculty: faculty._id,
      },
    },

    // Populate semesterRegistration
    {
      $lookup: {
        from: 'semesterregistrations',
        localField: 'semesterRegistration',
        foreignField: '_id',
        as: 'semesterRegistration',
      },
    },
    { $unwind: '$semesterRegistration' },

    // Filter by status (optional)
    ...(status
      ? [
          {
            $match: {
              'semesterRegistration.status': status,
            },
          },
        ]
      : []),

    // Populate course
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    { $unwind: '$course' },

    // Populate faculty
    {
      $lookup: {
        from: 'faculties',
        localField: 'faculty',
        foreignField: '_id',
        as: 'faculty',
      },
    },
    { $unwind: '$faculty' },

    // Populate academicsemesters
    {
      $lookup: {
        from: 'academicsemesters',
        localField: 'academicSemester',
        foreignField: '_id',
        as: 'academicSemester',
      },
    },
    {
      $unwind: {
        path: '$academicSemester',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];

  // Data query with sorting + pagination
  const result = await OfferedCourse.aggregate([
    ...basePipeline,
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: limit },
  ]);

  // Count query
  const totalResult = await OfferedCourse.aggregate([
    ...basePipeline,
    { $count: 'total' },
  ]);

  const total = totalResult[0]?.total || 0;
  const totalPage = Math.ceil(total / limit);

  return {
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
    result,
  };
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const offeredCourse = await OfferedCourse.findById(id);

  if (!offeredCourse) {
    throw new AppError(404, 'Offered Course not found');
  }

  return offeredCourse;
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
  getStudentOfferedCoursesFromDB,
  getFacultyOfferedCoursesFromDB,
};
