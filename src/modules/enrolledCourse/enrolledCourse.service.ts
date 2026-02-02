import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { Course } from '../course/course.model';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { Student } from '../student/student.model';
import { IEnrolledCourse } from './enrolledCourse.interface';
import EnrolledCourse from './enrolledCourse.model';

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

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
};
