import { Student } from './student.model';

const findLastStudentId = async () => {
  const lastStudent = await Student.findOne(
    {},
    { id: 1, _id: 0 },
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastStudent?.id;
};

export const generateStudentId = async () => {
  let currentId = '0';

  const lastStudentId = await findLastStudentId();

  if (lastStudentId) {
    currentId = lastStudentId.split('-')[1];
  }

  const incrementId = (Number(currentId) + 1)
    .toString()
    .padStart(4, '0');

  return `S-${incrementId}`;
};
