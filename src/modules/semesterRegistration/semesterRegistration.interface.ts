import { Types } from 'mongoose';
import { TSemesterRegistrationStatus } from './semesterRegistration.constant';

export type TCreateSemesterRegistrationPayload = {
  academicSemester: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
};

export interface ISemesterRegistration {
  academicSemester: Types.ObjectId;
  status: TSemesterRegistrationStatus;
  startDate: Date;
  endDate: Date;
  minCredit: number;
  maxCredit: number;
  isDeleted: boolean;
}
