import {STOCK_COL_SKU ,  STOCK_COL_QTY} from "../constants/index.js"


export default class StockProduct {
    constructor(rowProd) {
        this.sku = null;
        this.qty = null;
        this.allProps = {};
        this.parseRow(rowProd)
    }

    parseRow = (row) => new Promise((resolve, reject) => {
        try {
            this.sku = row[STOCK_COL_SKU];
            this.qty = parseInt(row[STOCK_COL_QTY]);

            for (const _props of Object.keys(row)) {
                this.allProps[_props] = row[_props];
            }

        } catch (error) {
            reject(error)
        }
    })

    getRemainedQty = () => this.qty
    setRemainedQty = (qty) =>{
        this.allProps[STOCK_COL_QTY] = qty
        this.qty = qty
    }
 
    printProduct = ()=> {
        console.log(`\nSKU: ${this.sku} , QTY : ${this.qty}`)
        console.log(`Other props===================== : `)
        for(const _props of Object.keys(this.allProps)) {
            console.log(`${_props} : ${this.allProps[_props]}`)
        }
    }

}