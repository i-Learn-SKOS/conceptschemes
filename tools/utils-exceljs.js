/**
 * This file contains some utilities on ExcelJS workbooks
 */

const ExcelJS = require('exceljs');

/**
 * Delete columns where the header is empty
 * @param workbook ExcelJS workbook to work on
 * @param onlySheet name of a sheet; if truish only that sheet will be processed
 * @param logger Winston logger
 */
function deleteHeaderlessColumns(workbook, onlySheet, logger) {
  if (workbook) {
    workbook.eachSheet(function (worksheet, sheetId) {
      if (!onlySheet || worksheet.name === onlySheet) {
        logger.info(`Deleting headerless columns in worksheet "${worksheet.name}"`);
        // for logger only:
        let offset = 0;
        // next code is robust against worksheet.spliceColumns() corrupting firstRow.eachCell()
        let deleteColumnLoopNeeded = true;
        while (deleteColumnLoopNeeded) {
          let deletedOne = false;
          let firstRow = worksheet.getRow(1);
          firstRow.eachCell(function (cell, colNumber) {
            if (!deletedOne) {
              if (!cell.text.trim()) {
                logger.debug(`Deleting column ${colNumber + offset++}`);
                worksheet.spliceColumns(colNumber, 1);
                deletedOne = true;
              }
            }
          });
          deleteColumnLoopNeeded = deletedOne;
        }
      }
    });
  } else {
    logger.error(`No workbook available`);
  }
}

/**
 * Convert text in cells:
 * - replace non-breaking space character with normal space character
 * - trim
 * @param workbook ExcelJS workbook to work on
 * @param onlySheet name of a sheet; if truish only that sheet will be processed
 * @param logger Winston logger
 */
function cleanText(workbook, onlySheet, logger) {
  if (workbook) {
    let nbspRegex = new RegExp(/\u00A0/g);
    workbook.eachSheet(function (worksheet, sheetId) {
      if (!onlySheet || worksheet.name === onlySheet) {
        logger.info(`Converting text in worksheet "${worksheet.name}"`);
        worksheet.eachRow(function (row, rowNumber) {
          row.eachCell(function (cell, colNumber) {
            if (typeof (cell.value) === "string") {
              let txt1 = cell.text;
              let txt2 = txt1.replace(nbspRegex, " ").trim();
              if (txt1 !== txt2) {
                  logger.debug(`Converting "${txt1}" --> "${txt2}"`);
                cell.value = txt2;
              }
            }
          });
        });
      }
    });
  } else {
    logger.error(`No workbook available`);
  }
}

/**
 * Make an object whose property names are header names taken from a first row and values are corresponding column numbers as used by ExcelJS
 * @param firstRow ExcelJS row of a first row, containing header names
 * @param logger Winston logger
 * @returns {{}} that object
 */
function getHeadersColumnNumbers(firstRow, logger) {
  const hc = {};
  firstRow.eachCell(function (cell, colNumber) {
    const h = cell.text;
    if (h) {
      if (hc.hasOwnProperty(h)) {
        logger.error(`Header "${h}" in use already; skipping column ${colNumber}`);
      } else {
        hc[h] = colNumber;
      }
    }
  });
  return hc;
}

/**
 * Add a column (if not yet existing)
 * @param firstRow ExcelJS row of a first row, containing header names
 * @param header text for the new header
 * @param logger Winston logger
 * @returns {{}} new object as would be returned from getHeadersColumnNumbers()
 */
function addColumnWithHeader(firstRow, header, logger) {
  const hc = getHeadersColumnNumbers(firstRow, logger);
  if (header) {
    if (hc.hasOwnProperty(header)) {
      logger.error(`Header "${header}" already exists at column number ${hc[header]}, no new column added`);
    } else {
      const c = firstRow.actualCellCount + 1;
      firstRow.getCell(c).value = header;
      hc[header] = c;
    }
  }
  return hc;
}

/**
 * Get a value (as text) from a row at column position given by a header name appearing in the first row
 * @param hc an object returned from getHeadersColumnNumbers for the current contents of the first row
 * @param row ExcelJS row of the scoped row
 * @param header the header
 * @param logger Winston logger
 * @returns {string}
 */
function getRowValueAtHeader(hc, row, header, logger) {
  let v = undefined;
  const columnNumber = hc[header];
  if (columnNumber === undefined) {
    logger.error(`Couldn't get value: no header "${header}"`);
  } else {
    try {
      const cell = row.getCell(columnNumber);
      v = cell.text || "";
    } catch (e) {
      logger.error(`Couldn't get value: no cell at column ${columnNumber}`);
    }
  }
  return v;
}

/**
 * Set a value in a row at column position given by a header name appearing in the first row
 * @param hc an object returned from getHeadersColumnNumbers for the current contents of the first row
 * @param row ExcelJS row of the scoped row
 * @param header the header
 * @param value the new value
 * @param logger Winston logger
 */
function setRowValueAtHeader(hc, row, header, value, logger) {
  const columnNumber = hc[header];
  if (columnNumber === undefined) {
    logger.error(`Couldn't set value "${value}": no header "${header}"`);
  } else {
    try {
      const cell = row.getCell(columnNumber);
      cell.value = value;
    } catch (e) {
      logger.error(`Couldn't set value "${value}": no cell at column ${columnNumber}`);
    }
  }
}



module.exports = {
  deleteHeaderlessColumns,
  cleanText,
  getHeadersColumnNumbers,
  addColumnWithHeader,
  getRowValueAtHeader,
  setRowValueAtHeader
}
