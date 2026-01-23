import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AdminServices } from './admin.service';

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const newAdmin = await AdminServices.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Admin is created successfully',
    data: newAdmin,
  });
});

const getAllAdmins = catchAsync(async (_req, res) => {
  const result = await AdminServices.getAllAdminsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admins are retrived successfully',
    data: result,
  });
});

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const reuslt = await AdminServices.getSingleAdminFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is retrived successfully',
    data: reuslt,
  });
});

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const result = await AdminServices.updateAdminIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is updated successfully',
    data: result,
  });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  await AdminServices.deleteAdminFromDB(id);

  sendResponse(res, {
    statusCode: 204,
    success: true,
    message: 'Admin is deleted successfully',
    data: null,
  });
});

export const AdminControllers = {
  createAdmin,
  getAllAdmins,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
