import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import { USER_ROLES } from '../users/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';

const router = Router();

router.post(
  '/create-course',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN, USER_ROLES.FACULTY, USER_ROLES.STUDENT),
  CourseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  CourseControllers.deleteCourse,
);

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN),
  CourseControllers.getAllCourses,
);

export const CourseRoutes = router;
