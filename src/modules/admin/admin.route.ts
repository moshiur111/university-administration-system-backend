import { Router } from 'express';
import auth from '../../middlewares/auth';
import authorize from '../../middlewares/authorize';
import { USER_ROLES } from '../users/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AdminValidations } from './admin.validation';
import { AdminControllers } from './admin.controller';
import requireSuperAdmin from '../../middlewares/requireSuperAdmin';

const router = Router();

router.post(
  '/create-admin',
  auth(),
  requireSuperAdmin,
  validateRequest(AdminValidations.createAdminValidationSchema),
  AdminControllers.createAdmin,
);

router.patch(
  '/:id',
  auth(),
  requireSuperAdmin,
  validateRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:id', auth(), requireSuperAdmin, AdminControllers.deleteAdmin);

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
  // requireSuperAdmin,
  AdminControllers.getAllAdmins,
);

export const AdminRoutes = router;
