import { Types } from 'mongoose';

export type TCreateEnrollmentPayload = {
  student: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
};


export interface IEnrollment {
  student: Types.ObjectId;
  academicSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  academicFaculty: Types.ObjectId;
  status: 'ACTIVE' | 'CANCELLED';
  isDeleted: boolean;
}

