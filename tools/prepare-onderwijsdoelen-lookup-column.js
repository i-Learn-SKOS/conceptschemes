/**
 * This tool's target is to prepare a file containing unique inputs for a column in a lookup table.
 *
 * This is a Q&D project.
 */

const fs = require('fs');
const commander = require("commander");
const ExcelJS = require('exceljs');
const createLogger = require("./create-logger");
const {deleteHeaderlessColumns, cleanText, getHeadersColumnNumbers, getRowValueAtHeader} = require("./utils-exceljs");

class PrepareOnderwijsdoelenLookupToolbox {
  /**
   * Constuctor
   * @logger An existing winston logger
   */
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Collect values obtained by concatenating the values of the given columns
   * @param onlySheet restrict processing to sheet with this name
   * @param headers array of headers for columns to process
   * @private
   */
  _collect(onlySheet, headers) {
    if (this.workbook) {
      this.workbook.eachSheet(function (worksheet, sheetId) {
        if (!onlySheet || worksheet.name === onlySheet) {
          this.logger.info(`Collecting from columns with headers "${headers.join(", ")}" in worksheet "${worksheet.name}"`);
          const firstRow = worksheet.getRow(1);
          const hc = getHeadersColumnNumbers(firstRow, this.logger);
          let ok = true;
          headers.forEach(header => {
            if (!hc.hasOwnProperty(header)) {
              ok = false;
              this.logger.warn(`Missing column with header: "${header}"`);
            }
          });
          if (ok) {
            if (this.collected === undefined) {
              this.collected = new Set();
            }
            worksheet.eachRow(function (row, rowNumber) {
              if (rowNumber > 1) {
                const texts = [];
                headers.forEach(header =>{
                  texts.push(getRowValueAtHeader(hc, row, header, this.logger));
                });
                // collect only if all columns have a non-empty value
                if (!texts.includes("")) {
                  const txt = texts.join("|");
                  this.collected.add(txt);
                } else {
                  this.logger.debug(`Skipping "${texts.join("|")}" in worksheet "${worksheet.name}" (not all columns have a value)`);

                }
              }
            }.bind(this));
          } else {
            this.logger.warn(`Skipping worksheet "${worksheet.name}" (not all expected columns available)`);
          }
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
    this.logger.info(`Handling file "${filename}"`);
  }

  /**
   * Add previously collected output from a text file
   * @param filename name of the text file
   */
  addFromFile(filename) {
    if (fs.existsSync(filename)) {
      if (this.collected === undefined) {
        this.collected = new Set();
      }
      const s1 = this.collected.size;
      const previous = new Set(fs.readFileSync(filename, 'utf8').split('\n'));
      for (const v of previous) {
        this.collected.add(v);
      }
      this.logger.info(`added ${this.collected.size - s1} values from "${filename}"`);
    }
  }

  /**
   * Process the contents
   * @param onlySheet restrict processing to sheet with this name
   * @param headers array of headers for columns to process
   */
  process(onlySheet, headers) {
    deleteHeaderlessColumns(this.workbook, onlySheet, this.logger);
    cleanText(this.workbook, onlySheet, this.logger);
    this._collect(onlySheet, headers);
  }

  /**
   * Write the values collected here into a text file
   * @param filename name of the text file
   */
  async write(filename) {
    if (this.collected) {
      fs.writeFileSync(filename, Array.from(this.collected).sort().join('\n'), 'utf8');
      this.logger.info(`Wrote file "${filename}"`);
    } else {
      this.logger.warn(`File "${filename}" not written (no data collected so far)`);
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
    .requiredOption("-c, --column-headers <column-headers...>", "Headers of columns to read")
    .option("-a, --add", "Add values from previous contents of output file")
    .requiredOption("-o, --output <filename>", "Output text file (*.txt)")
    .addOption(new commander.Option("-l, --log <level>", "Logging level").choices(["error", "warn", "info", "verbose", "debug", "silly"]).default("warn"))
    .parse(process.argv);
  const options = program.opts();
  const logger = createLogger(options.log);
  const box = new PrepareOnderwijsdoelenLookupToolbox(logger);
  await box.read(options.input);
  if (options.add) {
    box.addFromFile(options.output);
  }
  box.process(options.sheet, options.columnHeaders);
  await box.write(options.output);
})();
