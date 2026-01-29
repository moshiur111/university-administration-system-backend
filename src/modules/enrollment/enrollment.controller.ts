import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { EnrollmentServices } from './enrollment.service';

const createEnrollment = catchAsync(async (req, res) => {
  const result = await EnrollmentServices.createEnrollmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Enrollment created successfully',
    data: result,
  });
});

export const EnrollmentControllers = {
  createEnrollment,
};
