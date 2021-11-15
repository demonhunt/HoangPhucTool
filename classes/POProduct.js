import {PO_COL_SKU , PO_PRODUCT_STATUS , PO_COL_QTY} from "../constants/index.js"


export default class POProduct {
    constructor(prodData , poId) {
        this.sku = null;
        this.requireQty = null;
        this.fulfilledQty = 0;
        this.status = PO_PRODUCT_STATUS.NOT_PROCESSED
        this.allProps = {};
        this.poId = poId
        this.parseData(prodData);
    }

    parseData = (prodData) => new Promise((resolve, reject) => {
        try {
            this.sku = prodData[PO_COL_SKU]
            this.requireQty = prodData[PO_COL_QTY]
            for (const _props of Object.keys(prodData)) {
                this.allProps[_props] = prodData[_props];
            }

            resolve()
        } catch (error) {
            reject(error)
        }
    })

    printProduct = ()=> {
        console.log(`SKU: ${this.sku} , QTY : ${this.requireQty} , Status : ${this.status}`)
        console.log(`Other props===================== : `)
        for(const _props of Object.keys(this.allProps)) {
            console.log(`${_props} : ${this.allProps[_props]}`)
        }
    }

    setFulfilledQty = qty =>{
        this.fulfilledQty = qty;
        this.allProps[PO_COL_QTY] = qty
    }

    checkStockProd = (stockProd) => {
        if(!stockProd){
            this.status = PO_PRODUCT_STATUS.NOT_FOUND
        } else {
            let neededQty = this.requireQty - this.fulfilledQty;
            let stockQty = stockProd.getRemainedQty();
            if(neededQty > 0){
                if(neededQty > stockQty){
                    stockProd.setRemainedQty(0);
                    this.setFulfilledQty(this.fulfilledQty + stockQty)
                    this.fulfilledQty += stockQty
                    this.status = PO_PRODUCT_STATUS.NOT_ENOUGH_QTY
                } else {
                    stockProd.setRemainedQty(stockQty - neededQty);
                    this.setFulfilledQty(this.fulfilledQty + neededQty)
                    this.status = PO_PRODUCT_STATUS.FULFILLED
                }
            }
        }
    }

    isFulfilled = () =>{
        return this.requireQty <= this.fulfilledQty;
    }

   getUnfulfilledQty = ()=> this.requireQty - this.fulfilledQty
   getStatus = () =>this.status

}

