import Papa from 'papaparse';

export const readCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const csvData = reader.result;
        const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
        resolve(parsedData.data);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };

    reader.readAsText(file);
  });
};
