import POProduct from './POProduct.js'
import DataMap from './DataMap.js'
import { PO_COL_SKU , PO_COL_QTY } from '../constants/index.js'

export default class PO {
    constructor(poData, poId, poTitle) {
        this.productArray = []
        this.poId = poId
        this.poTitle = poTitle;
        this.parseData(poData);
        this.stockData = null
    }

    parseData = (poData) => new Promise((resolve, reject) => {
        try {
            this.productArray = poData.map(e => new POProduct(e, this.poId))

            resolve()
        } catch (error) {
            reject(error)
        }
    })

    setStockData = stockData => this.stockData = stockData

    printProducts = (idx) => {
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

    process = () => {
        for (const poProd of this.productArray) {
            let stockProd = this.stockData.find(poProd.sku)
            poProd.checkStockProd(stockProd)
        }

    }

    populatePoSheet = (wb) => {
        const sheet = wb.sheet(this.poId)
        const dataMap = new DataMap(sheet)
        for (const prod of this.productArray) {
            const {fulfilledQty , sku  } = prod
            dataMap.editColumnn(sku,PO_COL_SKU,fulfilledQty , PO_COL_QTY)
        }
    }

    generateProductReport = () =>{
        var reportArr = []
        for(const poProd of this.productArray){
            if(!poProd.isFulfilled()){
                
                reportArr.push({
                    'TO number' :  this.poId,
                    Barcode : poProd.sku,
                    'Số lượng' : poProd.getUnfulfilledQty(),
                    Note : poProd.getStatus()
                })
            }
        }
        return reportArr
    }
}

