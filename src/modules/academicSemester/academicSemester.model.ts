import { model, Query, Schema } from 'mongoose';
import { IAcademicSemester } from './academicSemester.interface';
import {
  ACADEMIC_SEMESTER_NAMES,
  MONTH_MAP,
  SEMESTER_MONTH_RANGE,
} from './academicSemester.constant';

const academicSemesterSchema = new Schema<IAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: ACADEMIC_SEMESTER_NAMES,
    },
    year: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

academicSemesterSchema.virtual('startMonthName').get(function () {
  return MONTH_MAP[SEMESTER_MONTH_RANGE[this.name].startMonth];
});

academicSemesterSchema.virtual('endMonthName').get(function () {
  return MONTH_MAP[SEMESTER_MONTH_RANGE[this.name].endMonth];
});

academicSemesterSchema.pre(/^find/, function (this: Query<any, any>) {
  this.where({ isDeleted: { $ne: true } });
});

export const AcademicSemester = model<IAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
