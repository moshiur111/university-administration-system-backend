import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyValidations } from './faculty.validation';
import { FacultyControllers } from './faculty.controller';
import authorize from '../../middlewares/authorize';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../users/user.constant';

const router = Router();

router.post(
  '/create-faculty',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  FacultyControllers.createFaculty,
);

router.get(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY),
  FacultyControllers.getSingleFaculty,
);

router.patch(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(FacultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  FacultyControllers.deleteFaculty,
);

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN),
  FacultyControllers.getAllFaculties,
);

export const FacultyRoutes = router;
