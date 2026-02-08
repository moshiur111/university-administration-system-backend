import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { StudentServices } from './student.service';

const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;

  const newStudent = await StudentServices.createStudentIntoDB(
    req.file,
    password,
    studentData,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Student is created successfully',
    data: newStudent,
  });
});

const getAllStudent = catchAsync(async (req, res) => {
  const students = await StudentServices.getAllStudentsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Students retrieved successfully',
    data: students,
  });
});

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const student = await StudentServices.getSingleStudentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student retrieved successfully',
    data: student,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const updatedStudent = await StudentServices.updateStudentIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student updated successfully',
    data: updatedStudent,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const { id } = req.params as { id: string };
  const deletedStudent = await StudentServices.deleteStudentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student deleted successfully',
    data: deletedStudent,
  });
});

export const StudentControllers = {
  createStudent,
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteStudent,
};