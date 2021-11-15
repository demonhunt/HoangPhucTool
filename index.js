import StockData from "./classes/TotalStock.js"
import POData from './classes/POData.js'
import { FILE_STOCK, FILE_PO, FILE_PO_FINAL, FILE_STOCK_FINAL } from "./constants/index.js"

const main = async () => {
    try {

        console.log(`----- Parsing stock file at ${FILE_STOCK} ----`)
        var stockData = new StockData(FILE_STOCK)

        console.log(`----- Parsing TO file at ${FILE_PO}----`)
        var poData = new POData(FILE_PO)
        poData.setStockData(stockData)

        console.log(`----- Processing Data ----`)
        await poData.processPOs();

        console.log(`----- Writing final stock file at ${FILE_STOCK_FINAL} ----`)
        stockData.exportExcel(FILE_STOCK, FILE_STOCK_FINAL);

        console.log(`----- Writing final TO file at ${FILE_PO_FINAL} ----`)
        poData.exportExcel(FILE_PO, FILE_PO_FINAL);
        console.log(`-------- ALL DONE !!!!----------`)
    } catch (error) {
        console.trace(error)
    }

}


main()