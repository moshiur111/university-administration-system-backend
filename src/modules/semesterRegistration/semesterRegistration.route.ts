import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../users/user.constant';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';

const router = Router();

router.post(
  '/create-semester-registration',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(
    SemesterRegistrationValidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegistration,
);

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN),
  SemesterRegistrationControllers.getAllSemesterRegistrations,
);

router.get(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  SemesterRegistrationControllers.getSingleSemesterRegistration,
);

router.patch(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(
    SemesterRegistrationValidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegistration,
);

router.delete(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  SemesterRegistrationControllers.deleteSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
