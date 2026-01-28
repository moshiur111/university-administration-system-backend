import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Academic Department created successfully',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.getAllAcademicDepartmentsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Departments retrieved successfully',
    data: result,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department retrieved successfully',
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const result =
    await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(
      id,
      req.body,
    );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department updated successfully',
    data: result,
  });
});

const deleteAcademicDepartment = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const result =
    await AcademicDepartmentServices.deleteAcademicDepartmentFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department deleted successfully',
    data: result,
  });
});

export const AcademicDepartmentControllers = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
  deleteAcademicDepartment,
};
