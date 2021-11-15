import XLSX from 'xlsx'
import { PO_COL_QTY , PO_COL_SKU , VALIDATE_ERROR } from '../constants/index.js';
import PO from './PO.js';
import DataMap from './DataMap.js'
import XlsxPopulate from "xlsx-populate"

export default class POData {
    constructor(filePath) {
        this.originalWorkbook = null
        this.poArray = []
        this.parseExcel(filePath);
    }

    setStockData = stockData =>{
        for (const po of this.poArray){
            po.setStockData(stockData)
        }
    }

    validateFile = (wb) => {
        var sheet_name_list = wb.SheetNames;
        var flagCheck = false;
        for (const sheetName of sheet_name_list) {
            if (sheetName.startsWith('TO')) {
                flagCheck = true;
                var xlData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { range: 1 });
                if(xlData.length > 0){
                    let listProps  = Object.keys(xlData[0])
                    if(!listProps.includes(PO_COL_QTY) ){
                        throw(`${VALIDATE_ERROR.QTY_COL_NOT_FOUND} : ${sheetName}`)
                    }
                    if(!listProps.includes(PO_COL_SKU) ){
                        throw(`${VALIDATE_ERROR.SKU_COL_NOT_FOUND} : ${sheetName}`)
                    }
                }
            }
        }
        if(!flagCheck) throw (VALIDATE_ERROR.NO_PO_FOUND)
    }


    parseExcel = (filePath) => {
        const wb = XLSX.readFile(filePath)
        this.validateFile(wb);
        var sheet_name_list = wb.SheetNames;
        for (const sheetName of sheet_name_list) {
            if (sheetName.startsWith('TO')) {
                var xlData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], { range: 1 });
                var xlData2 = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
                const poTitle = Object.keys(xlData2[0])[0]
                var po = new PO(xlData, sheetName ,poTitle);
                this.poArray.push(po)

            }
        }
        this.originalWorkbook = wb
    }

    processPOs = async () => {
        for(const po of this.poArray){
            po.process()
        }
     }

     printPOs = async (idx)=>{
        if (idx >= 0) { 
            if(idx <= this.poArray.length){
                this.poArray[idx].printProducts();
            } else {
                throw("OUT OF RANGE !!!");
            }
        } else {
            for (const po of this.poArray) {
                po.printProducts()
            }
        }
     }

     exportExcel = async  (pathSource , pathDes) =>{

         //Create file des
         await XlsxPopulate.fromFileAsync(pathSource).then(async wb => {
             for (const po of this.poArray) {
                 po.populatePoSheet(wb)
             }
             await wb.toFileAsync(pathDes)
         }).then(async () => {
             //Add report products
             const wb = await XLSX.readFile(pathDes)
             var jsonObjectArr = []
             for (const po of this.poArray) {
                 jsonObjectArr =[... jsonObjectArr,... po.generateProductReport()]
             }
             const sheet = await XLSX.utils.json_to_sheet(jsonObjectArr);
             delete wb.Sheets["Không xử lý được"]
             await XLSX.utils.book_append_sheet(wb, sheet, "Không xử lý được");
             XLSX.writeFile(wb,pathDes)
        })

     
    }

}

