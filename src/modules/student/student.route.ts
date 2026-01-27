import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import { USER_ROLES } from '../users/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { StudentValidations } from './student.validation';
import { StudentControllers } from './student.controller';

const router = Router();

router.post(
  '/create-student',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(StudentValidations.createStudentValidationSchema),
  StudentControllers.createStudent,
);

router.get(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  StudentControllers.getSingleStudent,
);

router.patch(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(StudentValidations.updateStudentValidationSchema),
  StudentControllers.updateStudent,
);

router.delete(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  StudentControllers.deleteStudent,
);

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN),
  StudentControllers.getAllStudent,
);

export const StudentRoutes = router;
