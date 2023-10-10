export const jobCSVTamplate = () => {
  const columnNames = ['name', 'description', 'status', 'startDate', 'endDate'];

  const placeholderData = [
    'Job A,Description A,completed,2023-08-01 18:30:05,2023-08-10 15:40:10',
    'Job B,Description B,in_process,2023-08-01 18:30:05,2023-08-10 15:40:10',
    'Job C,Description C,priority,2023-08-01 18:30:05,2023-08-10 15:40:10',
  ];

  const csvContent = `${columnNames.join(',')}\n${placeholderData.join('\n')}`;
  return csvContent;
};
