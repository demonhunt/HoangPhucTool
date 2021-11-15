import StockProduct from "./StockProduct.js"
import DataMap from './DataMap.js'
import XLSX from 'xlsx'
import XlsxPopulate from "xlsx-populate"
import { STOCK_COL_QTY, STOCK_COL_SKU, VALIDATE_ERROR , FILE_STOCK_FINAL} from "../constants/index.js"
export default class TotalStock {
    constructor(filePath) {
        this.originalWorkbook = null
        this.productArray = []
        this.parseExcel(filePath);
    }

    validateFile = (wb) => {
        var sheet_name_list = wb.SheetNames;
        for (const sheetName of sheet_name_list) {
            var xlData = XLSX.utils.sheet_to_json(wb.Sheets[sheetName]);
            if (xlData.length > 0) {
                let listProps = Object.keys(xlData[0])
                if (!listProps.includes(STOCK_COL_QTY)) {
                    throw (`${VALIDATE_ERROR.QTY_COL_NOT_FOUND} : ${sheetName}`)
                }
                if (!listProps.includes(STOCK_COL_SKU)) {
                    throw (`${VALIDATE_ERROR.SKU_COL_NOT_FOUND} : ${sheetName}`)
                }
            }
        }
    }


    parseExcel = (filePath) => new Promise(async (resolve, reject) => {
        try {
            const wb = XLSX.readFile(filePath)
            this.validateFile(wb)
            var sheet_name_list = wb.SheetNames;
            this.sheetName = sheet_name_list[0]
            var xlData = XLSX.utils.sheet_to_json(wb.Sheets[this.sheetName]);

            for (const row of xlData) {
                let product = new StockProduct(row);
                this.productArray.push(product)
            }
            this.originalWorkbook = wb
            resolve()
        } catch (error) {
            reject(error)
        }
    })

    printProds = (idx) => {
        if (idx >= 0) {
            if (idx <= this.productArray.length) {
                this.productArray[idx].printProduct();
            } else {
                throw ("OUT OF RANGE !!!");
            }
        } else {
            for (const prod of this.productArray) {
                prod.printProduct()
            }
        }

    }

    find = (sku) => {
        return this.productArray.find(prod => prod.sku === sku)
    }

    exportExcel =  (pathSource , pathDes) =>{
        XlsxPopulate.fromFileAsync(pathSource).then(wb=>{
            const sheet  = wb.sheet(this.sheetName);
            const dataMap = new DataMap(sheet);

            for(const prod of this.productArray){
                const {sku , qty} = prod    
                dataMap.editColumnn(sku , STOCK_COL_SKU , qty , STOCK_COL_QTY)
            }
            wb.toFileAsync(pathDes)
        })

    }

}

