import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;

  const newFaculty = await FacultyServices.createFacultyIntoDB(
    password,
    facultyData,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Faculty is created successfully',
    data: newFaculty,
  });
});

const getAllFaculties = catchAsync(async (_req, res) => {
  const faculties = await FacultyServices.getAllFacultyFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties are retrieved successfully',
    data: faculties,
  });
});

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const faculty = await FacultyServices.getSingleFacultyFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is retrieved successfully',
    data: faculty,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  const updatedFaculty = await FacultyServices.updateFacultyIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is updated successfully',
    data: updatedFaculty,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };

  const deletedFaculty = await FacultyServices.deleteFacultyFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is deleted successfully',
    data: deletedFaculty,
  });
});

export const FacultyControllers = {
  createFaculty,
  getAllFaculties,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
