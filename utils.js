import XLSX from 'xlsx'

export const readFile = (filePath) =>
  new Promise((resolve, reject) => {
    try {
      var workbook = XLSX.readFile(filePath);
      var sheet_name_list = workbook.SheetNames;

      for(const sheetName of sheet_name_list) {

      }
      var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
      resolve(xlData);
    } catch (error) {
      reject(error);
    }
  });



