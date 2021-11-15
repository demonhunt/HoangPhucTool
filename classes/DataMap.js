import {MAX_NODE_FIND} from '../constants/index.js'

export default class DataMap {
    constructor(sheet){
        this.sheet = sheet;
        this.headerRow =[];
        
        this.parseSheet();
    }

    parseSheet = ()=>{

        this.rows = this.sheet._rows
        for(const row of this.rows){
            if(row){
                var flagCheck = true
                for (let i = 1; i < MAX_NODE_FIND; i++) { //Silly way to find header row
                    if(typeof row.cell(i).value() != 'string'){
                        flagCheck = false
                    }
                }
                if(flagCheck){ //This is the header row of the sheet
                    let i = 1
                    while(row.cell(i) && row.cell(i).value()){
                        this.headerRow.push({
                            value : row.cell(i).value(), 
                            col : row.cell(i).columnNumber() 
                        })
                        i++
                    }
                    break;
                }
            }
        }
    }

    editColumnn = (valueToFind , valueToFindColumnName , newValue ,valueColumnName) =>{
        
        let colNumberToFind = this.findColumnNumberFromHeader(valueToFindColumnName)
        let colNumberToEdit = this.findColumnNumberFromHeader(valueColumnName)

        let rowNumberToEdit = this.findRowNumberFromValue(valueToFind , colNumberToFind)
        this.rows[rowNumberToEdit].cell(colNumberToEdit).value(newValue);
        
    }

    findRowNumberFromValue = (valueToFind, colNumberToFind) => {
        for (let i = 1; i < this.rows.length; i++) {
            if (this.rows[i].cell(colNumberToFind).value() == valueToFind) { return i }
            if (i === this.rows.length - 1) { throw ("VALUE_NOT_FOUND") }
        }
    }

    findColumnNumberFromHeader = (header) =>{
        for (let i = 0 ; i < this.headerRow.length ; i++){
            const {value, col} = this.headerRow[i];
            if(value== header){
                return col;
            }
            if(i === this.headerRow.length - 1) {throw("VALUE_NOT_FOUND")}
        }
        
    }

}