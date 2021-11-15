export const FILE_STOCK = './files/TotalStock.xlsx'
export const FILE_PO = './files/PO.xlsx'
export const FILE_STOCK_FINAL = './files/TotalStock_Final.xlsx'
export const FILE_PO_FINAL = './files/PO_Final.xlsx'
export const STOCK_COL_QTY = 'Số lượng khả dụng';
export const STOCK_COL_SKU = 'SCode';
export const PO_COL_SKU = 'Barcode'
export const PO_COL_QTY = 'Quantity'

export const PO_PRODUCT_STATUS = {
    NOT_ENOUGH_QTY : "Không đủ số lượng yêu cầu",
    NOT_FOUND : "Không tìm thấy",
    FULFILLED : "Đã đủ số lượng yêu cầu",
    NOT_PROCESSED : "Chưa xử lý"
}

export const VALIDATE_ERROR = { 
    QTY_COL_NOT_FOUND : "Không tìm thấy cột số lượng",
    SKU_COL_NOT_FOUND : "Không tìm thấy cột SKU",
    NO_PO_FOUND : "Không tìm thấy PO"
}

export const MAX_NODE_FIND = 5