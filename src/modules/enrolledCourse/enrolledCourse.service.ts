import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Course } from '../course/course.model';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Student } from '../student/student.model';
import { IEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';
import { Faculty } from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: IEnrolledCourse,
) => {
  const { offeredCourse } = payload;

  // Validated offered course
  const offeredCourseData = await OfferedCourse.findById(offeredCourse);

  if (!offeredCourseData) {
    throw new AppError(404, 'Offered course not found');
  }

  if (offeredCourseData.maxCapacity <= 0) {
    throw new AppError(400, 'Course capacity is full');
  }

  // Get student
  const student = await Student.findOne({ id: userId }, { _id: 1 });

  if (!student) {
    throw new AppError(404, 'Student not found');
  }

  // Prevent duplicate enrollment
  const isAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: offeredCourseData?.semesterRegistration,
    offeredCourse,
    student: student?._id,
    isDeleted: false,
  });

  if (isAlreadyEnrolled) {
    throw new AppError(400, 'Student is already enrolled in this course');
  }

  // Credit limit validation
  const course = await Course.findById(offeredCourseData?.course).select(
    'credits',
  );

  const semesterRegistration = await SemesterRegistration.findById(
    offeredCourseData?.semesterRegistration,
  ).select('maxCredit');

  const enrolledCredits = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: offeredCourseData?.semesterRegistration,
        student: student?._id,
        isDeleted: false,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalCredits: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalCredits: 1,
      },
    },
  ]);

  const totalCredits =
    enrolledCredits.length > 0 ? enrolledCredits[0].totalCredits : 0;

  if (
    semesterRegistration?.maxCredit &&
    course?.credits &&
    totalCredits + course.credits > semesterRegistration.maxCredit
  ) {
    throw new AppError(400, 'You have reached the maximum credit limit');
  }

  // Transaction-safe enrollment
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: offeredCourseData?.semesterRegistration,
          academicSemester: offeredCourseData?.academicSemester,
          academicFaculty: offeredCourseData?.academicFaculty,
          academicDepartment: offeredCourseData?.academicDepartment,
          offeredCourse,
          course: offeredCourseData?.course,
          student: student?._id,
          faculty: offeredCourseData?.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    );

    if (!result) {
      throw new AppError(400, 'Failed to enrolled this course');
    }

    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        $inc: { maxCapacity: -1 },
      },
      { session },
    );

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  } finally {
    await session.endSession();
  }
};

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<IEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'Semester registration not found');
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered course not found');
  }

  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError(404, 'Student not found');
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError(404, 'Faculty not found');
  }

  const isCourseBelongsToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongsToFaculty) {
    throw new AppError(400, 'This course does not belong to you');
  }

  const modifiedData: Record<string, unknown> = { ...courseMarks };

  if (courseMarks?.finalTerm) {
    const { classTest1, midTerm, classTest2, finalTerm } =
      isCourseBelongsToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isComplete = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongsToFaculty._id,
    modifiedData,
    { new: true },
  );

  return result;
};

const getMyEnrolledCourseFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await Student.findOne({ id: studentId });
  if (!student) {
    throw new AppError(404, 'Student not found');
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.countTotal();

  return {
    meta,
    result,
  };
};

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  updateEnrolledCourseMarksIntoDB,
  getMyEnrolledCourseFromDB,
};
