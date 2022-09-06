/**
 * Utility class to lookup values using a lookup table in a .xlsx file.
 */

const ExcelJS = require('exceljs');
const {getHeadersColumnNumbers} = require("./utils-exceljs");

class ExcelLookup {
  /**
   * Constuctor
   * @param logger An existing winston logger
   */
  constructor(logger) {
    this.logger = logger;
    this.workbook = undefined;
    this.map = undefined;
  }

  /**
   * Read Excel file into a workbook in this object
   * @param filename name of the Excel file
   */
  async read(filename) {
    this.workbook = new ExcelJS.Workbook();
    await this.workbook.xlsx.readFile(filename);
    this.logger.info(`Workbook ${filename} loaded`);
  }

  /**
   * Prepare lookup
   * @param sheetName name of the sheet containing the lookup table; the sheet is supposed to have column headers
   * @param columnIn column header text of the input column of the lookup table
   * @param columnOut column header text of the output column of the lookup table
   */
  prepareLookup(sheetName, columnIn, columnOut) {
    this.map = undefined;
    if (this.workbook) {
      const worksheet = this.workbook.getWorksheet(sheetName);
      if (worksheet) {
        const firstRow = worksheet.getRow(1);
        const hc = getHeadersColumnNumbers(firstRow, this.logger);
        for (const header of [columnIn, columnOut]) {
          if (!hc.hasOwnProperty(header)) {
            this.logger.error(`Missing column: ${header}`);
            throw Error(`Missing column: ${header}`);
          }
        }
        const map = new Map();
        worksheet.eachRow(function (row, rowNumber) {
          if (rowNumber > 1) {
            const valueInRaw = row.getCell(hc[columnIn]).value
            const valueOutRaw = row.getCell(hc[columnOut]).value;
            if (valueInRaw && valueOutRaw) {
              const valueIn = String(valueInRaw).trim();
              const valueOut = String(valueOutRaw).trim();
              map.set(valueIn, valueOut);
              this.logger.debug(`ExcelLookup preparation: "${valueIn}" --> "${valueOut}"`);
            }
          }
        }.bind(this));
        this.map = map;
      } else {
        this.logger.error(`Worksheet ${sheetName} not found`);
        throw new Error(`Worksheet ${sheetName} not found`);
      }
    } else {
      this.logger.error("No workbook available");
      throw new Error("No workbook available");
    }
  }

  /**
   * ExcelLookup
   * @param valueIn lookup input value
   * @returns String lookup output value; if lookup input value not found, return (unchanged) valueIn
   */
  lookup(valueIn) {
    if (this.map) {
      let valueOut;
      if (valueIn) {
        const valueInCleaned = String(valueIn).trim(); // gives "null" on empty cells, so filtering of these before
        valueOut = this.map.get(valueInCleaned) || valueIn;
        if (valueOut) {
          this.logger.debug(`ExcelLookup lookup: "${valueInCleaned}" --> "${valueOut}"`);
        } else {
          valueOut = valueIn;
          this.logger.debug(`ExcelLookup lookup: "${valueInCleaned}" not changed`);
        }
      } else {
        valueOut = valueIn;
      }
      return valueOut;
    } else {
      this.logger.error("ExcelLookup not prepared well");
      throw new Error("ExcelLookup not prepared well");
    }
  }
}

module.exports = ExcelLookup
