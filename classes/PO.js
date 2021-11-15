import POProduct from './POProduct.js'
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

}

