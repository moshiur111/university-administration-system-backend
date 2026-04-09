import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLES } from '../users/user.constant';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import { EnrolledCourseValidations } from './enrolledCourse.validation';

const router = Router();

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY),
  EnrolledCourseControllers.getAllEnrolledCourses,
);

router.post(
  '/create-enrolled-course',
  auth(),
  authorize(USER_ROLES.STUDENT),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

router.patch(
  '/update-enrolled-course-marks',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationSchema,
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
);

router.get(
  '/my-enrolled-courses',
  auth(),
  authorize(USER_ROLES.STUDENT),
  EnrolledCourseControllers.getMyEnrolledCourses,
);

export const EnrolledCourseRoutes = router;
