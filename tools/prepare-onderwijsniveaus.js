/**
 * This tool's target is to prepare an .xlsx file in ../input/onderwijsniveaus.
 *
 * This is a Q&D project.
 */

const commander = require("commander");
const ExcelJS = require('exceljs');
const createLogger = require("./create-logger");
const {slugify} = require("./utils-generic");
const {deleteHeaderlessColumns, cleanText, getHeadersColumnNumbers, addColumnWithHeader, getRowValueAtHeader, setRowValueAtHeader} = require("./utils-exceljs");

// in the order of how the id is to be constructed:
const columnHeadersNeeded = [
  "Onderwijsniveau",
  "Onderwijssubniveau",
  "jaar/graad",
  "Finaliteit",
  "Onderwijsvorm"];

const transformationsForId = {
  "Onderwijsniveau": x => {
    if (/basis/i.test(x)) {
      return "basis";
    } else if (/sec/i.test(x)) {
      return "sec";
    } else if (/info/i.test(x)) {
      return "";
    } else {
      return {error: `Unsupported Onderwijsniveau entry: "${x}"`};
    }
  },
  "Onderwijssubniveau": x => {
    if (/kleuter/i.test(x)) {
      return "kleuter";
    } else if (/lager/i.test(x)) {
      return "lager";
    } else {
      return "";
    }
  },
  "jaar/graad": x => {
    const a = [...x.matchAll(/[0-9]+/g)];
    if (/[0-9]+[^0-9]+[0-9]+/i.test(x)) {
      return "gr" + a[0][0] + "lj" + a[1][0];
    } else if (/graad/i.test(x)) {
      return "gr" + a[0][0];
    } else if (/leerjaar/i.test(x)) {
      return "lj" + a[0][0];
    } else if (/jaar/i.test(x)) {
      return a[0][0] + "j";
    } else {
      return "";
    }
  },
  "Finaliteit": x => {
    if (/a-/i.test(x)) {
      return "astroom";
    } else if (/b-/i.test(x)) {
      return "bstroom";
    } else if (/doorstroom/i.test(x)) {
      return "doorstroom";
    } else if (/arbeids/i.test(x)) {
      return "arbeidsmarkt";
    } else if (/dubbel/i.test(x)) {
      return "dubbel";
    } else {
      return "";
    }
  },
  "Onderwijsvorm": x => {
    if (/aso|tso|kso|bso/i.test(x)) {
      return x;
    } else {
      return "";
    }
  }
}

// possible values for the Mapping column
const mappings = {
  "None": "",
  "Onderwijsniveau": "niveau",
  "Onderwijssubniveau": "subniveau",
  "jaar/graad": "graad",
  "Finaliteit": "finaliteit",
  "Onderwijsvorm": "onderwijsvorm"
};

class PrepareOnderwijsniveausToolbox {
  /**
   * Constuctor
   * @param logger An existing winston logger
   */
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Add columns Id, ParentId, Mapping and fill them with a unique value derived from other columns
   * @param onlySheet restrict processing to sheet with this name
   * @private
   */
  _addColumnsIdParentIdMapping(onlySheet) {
    if (this.workbook) {
      this.workbook.eachSheet(function (worksheet, sheetId) {
        if (!onlySheet || worksheet.name === onlySheet) {
          this.logger.info(`Adding columns Id, ParentId, Mapping in worksheet "${worksheet.name}"`);
          const firstRow = worksheet.getRow(1);
          const hc = getHeadersColumnNumbers(firstRow, this.logger);
          this.logger.debug(`Headers --> column numbers:\n${JSON.stringify(hc, null, 2)}`);
          // check if all headers are available
          columnHeadersNeeded.forEach(header => {
            if (!hc.hasOwnProperty(header)) {
              this.logger.error(`Missing column: ${header}`);
              process.exit(2);
            }
          });

          // Add columns this way and not using worksheet.spliceColumns(); the latter sometimes corrupts the Excel file...
          addColumnWithHeader(firstRow, "Id", this.logger);
          addColumnWithHeader(firstRow, "ParentId", this.logger);
          const hcEx = addColumnWithHeader(firstRow, "Mapping", this.logger);
          this.logger.debug(`Headers --> column numbers:\n${JSON.stringify(hcEx, null, 2)}`);
          // now fill the new columns row per row
          worksheet.eachRow(function (row, rowNumber) {
            if (rowNumber > 1) {
              let id = "";
              let parentId = "";
              let mapping = mappings["None"];
              let faulty = false;
              columnHeadersNeeded.forEach((header, index) => {
                if (!faulty) {
                  let txt = getRowValueAtHeader(hcEx, row, header, this.logger);
                  if (txt) {
                    let r = transformationsForId[header](txt);
                    if (typeof (r) !== "string") {
                      this.logger.warn(`No Id for row ${rowNumber} because: ${r.error}`);
                      id = "";
                      parentId = "";
                      faulty = true;
                    } else {
                      let s = slugify(r);
                      if (s.length > 0) {
                        if (id.length > 0) {
                          parentId = id;
                          id = id + "-" + s;
                        } else {
                          id = s;
                        }
                        mapping = mappings[header];
                      }
                    }
                  }
                }
              });
              setRowValueAtHeader(hcEx, row, "Id", id, this.logger);
              setRowValueAtHeader(hcEx, row, "ParentId", parentId, this.logger);
              setRowValueAtHeader(hcEx, row, "Mapping", mapping, this.logger);
              this.logger.debug(`Id: ${id}`);
              this.logger.debug(`ParentId: ${parentId}`);
              this.logger.debug(`Mapping: ${mapping}`);
            }
          }.bind(this));
        }
      }.bind(this));
    } else {
      this.logger.error(`No workbook available`);
    }
  }

  /**
   * Read Excel file into a workbook in this object
   * @param filename name of the Excel file
   */
  async read(filename) {
    this.workbook = new ExcelJS.Workbook();
    await this.workbook.xlsx.readFile(filename);
  }

  /**
   * Process the contents
   * @param onlySheet restrict processing to sheet with this name
   */
  process(onlySheet) {
    deleteHeaderlessColumns(this.workbook, onlySheet, this.logger);
    cleanText(this.workbook, onlySheet, this.logger);
    this._addColumnsIdParentIdMapping(onlySheet);
  }

  /**
   * Write the workbook in this object into an Excel file
   * @param filename name of the Excel file
   * @param csv boolean to write to csv or not
   * @param sheetName sheetName to select when writing to csv
   */
  async write(filename, csv = false, sheetName = "") {
    if (this.workbook) {
      if (csv) {
        await this.workbook.csv.writeFile(filename, {
          dateFormat: "DD/MM/YYYY",
          dateUTC: true,
          sheetName: sheetName,
          formatterOptions: {
            includeEndRowDelimiter: true,
            headers: true
          }
        });
      }
      else {
        await this.workbook.xlsx.writeFile(filename);
      }
    } else {
      this.logger.error(`No workbook available`);
    }
  }
}

/**
 * Start
 */
(async function main() {
  // command line
  const program= new commander.Command();
  program
    .requiredOption("-i, --input <filename>", "Input Excel file (*.xlsx)")
    .option("-s, --sheet <sheetname>", "If given, handle this sheet only", "")
    .requiredOption("-o, --output <filename>", "Output file (*.xlsx or *.csv)")
    .option("-c, --csv", "Output as CSV instead of XLSX?")
    .addOption(new commander.Option("-l, --log <level>", "Logging level").choices(["error", "warn", "info", "verbose", "debug", "silly"]).default("warn"))
    .parse(process.argv);
  const options = program.opts();
  const logger = createLogger(options.log);
  const box = new PrepareOnderwijsniveausToolbox(logger);
  await box.read(options.input);
  box.process(options.sheet);
  await box.write(options.output, options.csv, options.sheet);
})();
