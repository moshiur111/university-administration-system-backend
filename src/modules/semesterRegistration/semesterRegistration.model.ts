import { model, Schema } from 'mongoose';
import { ISemesterRegistration } from './semesterRegistration.interface';
import { SEMESTER_REGISTRATION_STATUS } from './semesterRegistration.constant';

const semesterRegistrationSchema = new Schema<ISemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: true,
    },
    status: {
      type: String,
      enum: SEMESTER_REGISTRATION_STATUS,
      default: SEMESTER_REGISTRATION_STATUS.UPCOMING,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    minCredit: {
      type: Number,
      required: true,
    },
    maxCredit: {
      type: Number,
      required: true,
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

export const SemesterRegistration = model<ISemesterRegistration>(
  'SemesterRegistration',
  semesterRegistrationSchema,
);
