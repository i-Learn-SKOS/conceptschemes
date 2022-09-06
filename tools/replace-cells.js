/**
 * This tool's target is to replace cells in  a .xlsx file, using a lookup table in another .xlsx file.
 */

const commander = require("commander");
const createLogger = require("./create-logger");
const ExcelJS = require('exceljs');
const ExcelLookup = require("./utils-excel-lookup");

/**
 * Start
 */
(async function main() {
  // command line
  const program = new commander.Command();
  program
    .requiredOption("-i, --input <filename>", "Input Excel file (*.xlsx)")
    .requiredOption("-s, --sheet <sheetname>", "Sheet to handle")
    .option("-o, --output <filename>", "Output Excel or CSV file (*.xlsx or *.csv) (if not given, write back to input Excel file)", "")
    .requiredOption("-L, --lookupFile <filename>", "Lookup Excel file (*.xlsx)")
    .requiredOption("-S, --lookupSheet <sheetname>", "Sheet containing lookup table")
    .requiredOption("-I, --lookupInputColumn <columnheader>", "Lookup table input column header")
    .requiredOption("-O, --lookupOutputColumn <columnheader>", "Lookup table output column header")
    .addOption(new commander.Option("-l, --log <level>", "Logging level").choices(["error", "warn", "info", "verbose", "debug", "silly"]).default("warn"))
    .parse(process.argv);

  const options = program.opts();
  const logger = createLogger(options.log);

  const excelLookup = new ExcelLookup(logger);
  await excelLookup.read(options.lookupFile);
  excelLookup.prepareLookup(options.lookupSheet, options.lookupInputColumn, options.lookupOutputColumn);

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(options.input);

  workbook.eachSheet(function (worksheet, id) {
    if (!options.sheet || worksheet.name === options.sheet) {
      worksheet.eachRow(function (row, rowNumber) {
        row.eachCell(function (cell, colNumber) {
          cell.value = excelLookup.lookup(cell.value);
        });
      });
    }
  });

  const fileOut = options.output ? options.output : options.input;
  if (fileOut.endsWith(".xlsx")) {
    await workbook.xlsx.writeFile(fileOut);
  } else {
    await workbook.csv.writeFile(fileOut, {
      dateFormat: "DD/MM/YYYY",
      dateUTC: true,
      sheetName: options.sheet,
      formatterOptions: {
        includeEndRowDelimiter: true,
        headers: true
      }
    });

  }
})();
