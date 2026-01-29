import { Schema, model } from 'mongoose';
import {
  IStudent,
  TGuardian,
  TLocalGuardian,
  TUserName,
} from './student.interface';

const userNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
    },
  },
  { _id: false },
);

const guardianSchema = new Schema<TGuardian>(
  {
    fatherName: {
      type: String,
      required: [true, 'Father name is required'],
    },
    fatherOccupation: {
      type: String,
      required: [true, 'Father occupation is required'],
    },
    fatherContactNo: {
      type: String,
      required: [true, 'Father contact number is required'],
    },
    motherName: {
      type: String,
      required: [true, 'Mother name is required'],
    },
    motherOccupation: {
      type: String,
      required: [true, 'Mother occupation is required'],
    },
    motherContactNo: {
      type: String,
      required: [true, 'Mother contact number is required'],
    },
  },
  { _id: false },
);

const localGuardianSchema = new Schema<TLocalGuardian>(
  {
    name: {
      type: String,
      required: [true, 'Local guardian name is required'],
    },
    occupation: {
      type: String,
      required: [true, 'Local guardian occupation is required'],
    },
    contactNo: {
      type: String,
      required: [true, 'Local guardian contact number is required'],
    },
    address: {
      type: String,
      required: [true, 'Local guardian address is required'],
    },
  },
  { _id: false },
);

const studentSchema = new Schema<IStudent>(
  {
    id: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
    },
    name: {
      type: userNameSchema,
      required: [true, 'Student name is required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: 'Gender must be either male or female',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: Date,
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
    },
    profileImg: {
      type: String,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact number is required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency contact number is required'],
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: 'Invalid blood group value',
      },
    },
    presentAddress: {
      type: String,
      required: [true, 'Present address is required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent address is required'],
    },
    guardian: {
      type: guardianSchema,
      required: [true, 'Guardian information is required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'Local guardian information is required'],
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
      required: [true, 'Admission semester is required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: [true, 'Academic department is required'],
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
      required: [true, 'Academic faculty is required'],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

export const Student = model<IStudent>('Student', studentSchema);
