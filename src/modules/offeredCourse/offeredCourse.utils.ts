import { TSchedule } from './offeredCourse.interface';

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedule: TSchedule,
) => {
  const newDays = Array.isArray(newSchedule.days)
    ? newSchedule.days
    : [newSchedule.days];

  for (const schedule of assignedSchedules) {
    const existingDays = Array.isArray(schedule.days)
      ? schedule.days
      : [schedule.days];

    // Check if any day overlaps
    const isDayOverlap = newDays.some((day) => existingDays.includes(day));

    if (!isDayOverlap) continue;

    // Time comparison
    const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};
