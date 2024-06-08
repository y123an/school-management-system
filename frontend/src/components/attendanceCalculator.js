export const calculateSubjectAttendancePercentage = (
  presentCount,
  totalSessions
) => {
  if (totalSessions === 0 || presentCount === 0) {
    return 0;
  }
  const percentage = (presentCount / totalSessions) * 100;
  return percentage.toFixed(2); // Limit to two decimal places
};

export const calculateOverallAttendancePercentage = (subjectAttendance) => {
  const totalSessions = subjectAttendance.length;
  const presentCount = subjectAttendance.filter(
    (att) => att.status === "Present"
  ).length;

  if (totalSessions === 0) {
    return 0;
  }

  return (presentCount / totalSessions) * 100;
};
