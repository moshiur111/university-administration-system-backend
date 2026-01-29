import { model, Query, Schema } from 'mongoose';
import { IEnrollment } from './enrollment.interface';

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'CANCELLED'],
      default: 'ACTIVE',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * One student can have only one ACTIVE enrollment
 * per academic semester.
 * Soft-deleted enrollments are ignored.
 */
enrollmentSchema.index(
  { student: 1, academicSemester: 1 },
  {
    unique: true,
    partialFilterExpression: { isDeleted: { $eq: false } },
  },
);

/**
 * Exclude soft-deleted records from all find queries
 */
enrollmentSchema.pre(/^find/, function (this: Query<any, any>) {
  this.where({ isDeleted: { $ne: true } });
});

export const Enrollment = model<IEnrollment>('Enrollment', enrollmentSchema);
