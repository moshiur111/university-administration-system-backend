import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import { USER_ROLES } from '../users/user.constant';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

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
