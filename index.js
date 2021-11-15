import StockData from "./classes/TotalStock.js"
import POData from './classes/POData.js'
import { FILE_STOCK, FILE_PO, FILE_PO_FINAL, FILE_STOCK_FINAL } from "./constants/index.js"

const main = async () => {
    try {
        var stockData = new StockData(FILE_STOCK)
        var poData = new POData(FILE_PO)
        poData.setStockData(stockData)
        await poData.processPOs();
        stockData.exportExcel(FILE_STOCK, FILE_STOCK_FINAL);
        poData.exportExcel(FILE_PO, FILE_PO_FINAL);
    } catch (error) {
        console.trace(error)
    }

}


main()