import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import { USER_ROLES } from '../users/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { EnrollmentValidations } from './enrollment.validation';
import { EnrollmentControllers } from './enrollment.controller';

const router = Router();

router.post(
  '/create-enrollment',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(EnrollmentValidations.createEnrollmentValidationSchema),
  EnrollmentControllers.createEnrollment,
);

export const EnrollmentRoutes = router;