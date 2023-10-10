export const validateJobData = (jobsData) => {
  const validatedJobs = jobsData.map((job) => {
    const { name, description, status, startDate, endDate } = job;
    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    // Validate name: Check if it contains only letters and numbers
    const nameRegex = /^[a-zA-Z0-9 ]+$/;
    const isNameValid = nameRegex.test(trimmedName);

    // Validate status: Check if it is one of the allowed values
    const allowedStatusValues = ['in_process', 'completed', 'priority'];
    const isStatusValid = allowedStatusValues.includes(status);

    // Validate dates: Check if they are in a valid date format
    const isStartDateValid = !isNaN(new Date(startDate).getTime());
    const isEndDateValid = !isNaN(new Date(endDate).getTime());

    // Return the validated job object or null for invalid data
    if (isNameValid && isStatusValid && isStartDateValid && isEndDateValid) {
      return {
        ...job,
        name: trimmedName,
        description: trimmedDescription,
      };
    } else {
      return null;
    }
  });

  // Filter out null values (invalid data)
  const validJobs = validatedJobs.filter((job) => job !== null);

  return validJobs;
};
