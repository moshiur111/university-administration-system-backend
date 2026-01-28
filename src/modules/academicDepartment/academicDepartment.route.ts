import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicDepartmentValidations } from './academicDepartment.validation';
import { AcademicDepartmentControllers } from './academicDepartment.controller';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import { USER_ROLES } from '../users/user.constant';

const router = Router();

router.post(
  '/create-academic-department',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(
    AcademicDepartmentValidations.createAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.createAcademicDepartment,
);

router.get(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY, USER_ROLES.STUDENT),
  AcademicDepartmentControllers.getSingleAcademicDepartment,
);

router.patch(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(
    AcademicDepartmentValidations.updateAcademicDepartmentValidationSchema,
  ),
  AcademicDepartmentControllers.updateAcademicDepartment,
);

router.delete(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  AcademicDepartmentControllers.deleteAcademicDepartment,
);

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY, USER_ROLES.STUDENT),
  AcademicDepartmentControllers.getAllAcademicDepartments,
);


export const AcademicDepartmentRoutes = router;
