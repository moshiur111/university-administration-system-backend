import { TAdminType, TBloodGroup, TGender } from './admin.interface';

export const Gender: TGender[] = ['male', 'female'];

export const BloodGroup: TBloodGroup[] = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
];

export const AdminType = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
} as const;

export const AdminTypeEnum: TAdminType[] = Object.values(AdminType);