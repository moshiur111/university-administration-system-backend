import { model, Query, Schema } from 'mongoose';
import {
  ACADEMIC_SEMESTER_NAMES,
  MONTH_MAP,
  SEMESTER_MONTH_RANGE,
} from './academicSemester.constant';
import { IAcademicSemester } from './academicSemester.interface';

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
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Compound unique constrant
academicSemesterSchema.index({ name: 1, year: 1 }, { unique: true });

academicSemesterSchema.virtual('startMonth').get(function () {
  return MONTH_MAP[SEMESTER_MONTH_RANGE[this.name].startMonth];
});

academicSemesterSchema.virtual('endMonth').get(function () {
  return MONTH_MAP[SEMESTER_MONTH_RANGE[this.name].endMonth];
});

// soft delete filter
academicSemesterSchema.pre(/^find/, function (this: Query<any, any>) {
  this.where({ isDeleted: { $ne: true } });
});

export const AcademicSemester = model<IAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
);
