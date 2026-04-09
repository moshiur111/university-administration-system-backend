import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../users/user.constant';
import { OfferedCourseControllers } from './offeredCourse.controller';
import { OfferedCourseValidations } from './offeredCourse.validation';

const router = Router();

router.post(
  '/create-offered-course',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.get(
  '/student-offered-courses',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY, USER_ROLES.STUDENT),
  OfferedCourseControllers.getStudentOfferedCourses,
);
router.get(
  '/faculty-offered-courses',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY),
  OfferedCourseControllers.getFacultyOfferedCourses,
);

router.get(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY, USER_ROLES.STUDENT),
  OfferedCourseControllers.getSingleOfferedCourse,
);

router.patch(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  OfferedCourseControllers.deleteOfferedCourse,
);

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY, USER_ROLES.STUDENT),
  OfferedCourseControllers.getAllOfferedCourses,
);

export const OfferedCourseRoutes = router;
