import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import { USER_ROLES } from '../users/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import { AdminControllers } from './admin.controller';

const router = Router();

router.post(
  '/create-admin',
  //   auth(),
  //   authorize(USER_ROLES.ADMIN),
  validateRequest(AdminValidations.createAdminValidationSchema),
  AdminControllers.createAdmin,
);

router.patch(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  AdminControllers.updateAdmin,
);

router.delete(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  AdminControllers.deleteAdmin,
);

router.get(
  '/:id',
  auth(),
  authorize(USER_ROLES.ADMIN),
  AdminControllers.getSingleAdmin,
);

router.get(
  '/',
  auth(),
  authorize(USER_ROLES.ADMIN),
  AdminControllers.getAllAdmins,
);

export const AdminRoutes = router;
