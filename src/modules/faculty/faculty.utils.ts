import { Faculty } from './faculty.model';

const findLastFacultyId = async () => {
  const lastFaculty = await Faculty.findOne({}, { id: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .lean();

  return lastFaculty?.id ? lastFaculty.id : undefined;
};

export const generateFacultyId = async () => {
  let currentId = '0';

  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.split('-')[1];
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  return `F-${incrementId}`;
};
