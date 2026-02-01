import { Types } from 'mongoose';

export type TPreRequisiteCourses = {
  course: Types.ObjectId;
  isDeleted: boolean;
};

export interface ICourse {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  preRequisiteCourses?: [TPreRequisiteCourses];
  isDeleted: boolean;
}
