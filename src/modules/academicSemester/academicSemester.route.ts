import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import { USER_ROLES } from '../users/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterController } from './academicSemeter.controller';
import { AcademicSemesterValidations } from './academicSemester.validation';

const router = Router();

router.post(
  '/create-academic-semester',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(
    AcademicSemesterValidations.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.createAcademicSemester,
);

router.patch(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(
    AcademicSemesterValidations.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterController.updateAcademicSemester,
);

router.delete(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  AcademicSemesterController.deleteAcademicSemester,
);

router.get(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY, USER_ROLES.STUDENT),
  AcademicSemesterController.getSingleAcademicSemester,
);

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY, USER_ROLES.STUDENT),
  AcademicSemesterController.getAllAcademicSemesters,
);

export const AcademicSemesterRoutes = router;
