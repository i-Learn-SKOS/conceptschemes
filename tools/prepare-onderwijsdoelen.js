/**
 * This tool's target is to prepare an .xlsx file in ../input/onderwijsdoelen.
 *
 * This is a Q&D project.
 */

const commander = require("commander");
const ExcelJS = require('exceljs');
const createLogger = require("./create-logger");
const { slugify } = require("./utils-generic");
const { deleteHeaderlessColumns, cleanText, getHeadersColumnNumbers, addColumnWithHeader, getRowValueAtHeader, setRowValueAtHeader } = require("./utils-exceljs");

// in the order of how the id is to be constructed:
const columnHeadersToConsiderForId = [
  "Niveau",
  "Onderwijsstructuur",
  "Soort",
  "Graad",
  "Stroom",
  "Finaliteit",
  "Onderwijsvorm",
  "Indeling",
  "Sleutelcompetentie",
  "Wetenschapsdomein",
  "Nummer / Code"]

// in the order of how the ondniv is to be constructed:
// we don't take 'onderwijsvorm' into account as one field contains multiple values.
// It would complicate the code without use (as onderwijsvorm is determined by Finaliteit)
const columnHeadersToConsiderForOndNivId = [
  "Niveau",
  "Onderwijsstructuur",
  "Graad",
  "Stroom",
  "Finaliteit"
]

// transformation functions per column header: from column contents to parts of the id
const transformationsForId = {
  "Niveau": x => {
    if (/basis/i.test(x)) {
      return "basis";
    } else if (/sec/i.test(x)) {
      return "sec";
    }
    else {
      return { error: `Unsupported Niveau entry: "${x}"` };
    }
  },
  "Onderwijsstructuur": x => {
    if (/lager/i.test(x)) {
      return "lager";
    } else {
      return { error: `Unsupported Onderwijsstructuur entry: "${x}"` };
    }
  },
  "Soort": x => {
    if (/buitengewoon/i.test(x)) {
      return "buitengewoon";
    } else if (/gewoon/i.test(x)) {
      return "";
    } else {
      return { error: `Unsupported Soort entry: "${x}"` };
    }
  },
  "Graad": x => {
    if (/1/i.test(x)) {
      return "gr1";
    } else if (/2/i.test(x)) {
      return "gr2";
    } else if (/3/i.test(x)) {
      return "gr3";
    } else {
      return { error: `Unsupported Graad entry: "${x}"` };
    }
  },
  "Stroom": x => {
    if (/a-/i.test(x)) {
      return "astroom";
    } else if (/b-/i.test(x)) {
      return "bstroom";
    } else {
      return { error: `Unsupported Stroom entry: "${x}"` };
    }
  },
  "Finaliteit": x => {
    if (/doorstroom/i.test(x)) {
      return "doorstroom";
    } else if (/arbeids/i.test(x)) {
      return "arbeidsmarkt";
    } else if (/dubbel/i.test(x)) {
      return "dubbel";
    } else {
      return { error: `Unsupported Finaliteit entry: "${x}"` };
    }
  },
  "Onderwijsvorm": x => x,
  "Indeling": x => { // return value based on part of the URI of the 12 leergebieden in curr2
    if (/wiskunde/i.test(x)) {
      return "wiskunde";
    } else if (/nederlands/i.test(x)) {
      return "nederlands";
    } else if (/frans/i.test(x)) {
      return "frans";
    } else if (/mens.*maatschappij/i.test(x)) {
      return "mens-en-maatschappij";
    } else if (/muzische/i.test(x)) {
      return "muzische-vorming";
    } else if (/wetenschap.*techniek/i.test(x)) {
      return "wetenschap-en-techniek";
    } else if (/ict/i.test(x)) {
      return "ict";
    } else if (/levensbeschouwelijk/i.test(x)) {
      return "levensbeschouwelijke-vakken";
    } else if (/lichamelijke.*opvoeding/i.test(x)) {
      return "lichamelijke-opvoeding";
    } else if (/leren.*leren/i.test(x)) {
      return "leren-leren";
    } else if (/sociale.*vaardigheden/i.test(x)) {
      return "sociale-vaardigheden";
    } else if (/extra.*curriculair/i.test(x)) {
      return "extra-curriculair";
    } else {
      return { error: `Unsupported Sleutelcompetentie entry: "${x}"` };
    }
  },
  "Sleutelcompetentie": x => { // return value based on part of the URI of the 17 sleutelcompetenties in curr1
    if (/andere.*talen/i.test(x)) {
      return "andere-talen";
    } else if (/burgerschap.*samenleven/i.test(x)) {
      return "burgerschap-en-samenleven";
    } else if (/cultureel/i.test(x)) {
      return "cultureel-bewustzijn-en-culturele-expressie";
    } else if (/mediawijsheid/i.test(x)) {
      return "digitale-competenties-en-mediawijsheid";
    } else if (/duurzaamheid/i.test(x)) {
      return "duurzaamheid";
    } else if (/economisch/i.test(x)) {
      return "economisch-financiele-competenties";
    } else if (/historisch/i.test(x)) {
      return "historisch-bewustzijn";
    } else if (/juridisch/i.test(x)) {
      return "juridische-competenties";
    } else if (/leercompetenties/i.test(x)) {
      return "leercompetenties";
    } else if (/geestelijk/i.test(x)) {
      return "lichamelijk-geestelijk-en-emotioneel-welzijn";
    } else if (/nederlands/i.test(x)) {
      return "nederlands";
    } else if (/ondernemingszin/i.test(x)) {
      return "ondernemingszin";
    } else if (/levenbeschouwing/i.test(x)) {
      return "religie-en-levensbeschouwing";
    } else if (/ruimtelijk/i.test(x)) {
      return "ruimtelijk-bewustzijn";
    } else if (/sociaal/i.test(x)) {
      return "sociaal-relationele-vorming";
    } else if (/wiskunde.*wetenschappen.*technologie/i.test(x)) {
      return "stem";
    } else if (/zelfbewustzijn/i.test(x)) {
      return "zelfbewustzijn";
    } else {
      return { error: `Unsupported Sleutelcompetentie entry: "${x}"` };
    }
  },
  "Wetenschapsdomein": x => { // return value based on part of URI of the 16 wetenschapsdomeinen in curr1
    if (/aardwetenschappen/i.test(x)) {
      return "aardwetenschappen";
    } else if (/algemene.*doorstroomcompetenties/i.test(x)) {
      return "algemene-doorstroomcompetenties";
    } else if (/bewegingswetenschappen/i.test(x)) {
      return "bewegingswetenschappen";
    } else if (/biologie/i.test(x)) {
      return "biologie";
    } else if (/chemie/i.test(x)) {
      return "chemie";
    } else if (/economie/i.test(x)) {
      return "economie";
    } else if (/filosofie/i.test(x)) {
      return "filosofie";
    } else if (/fysica/i.test(x)) {
      return "fysica";
    } else if (/gedragswetenschappen/i.test(x)) {
      return "gedragswetenschappen";
    } else if (/informaticawetenschappen/i.test(x)) {
      return "informaticawetenschappen";
    } else if (/klassieke.*talen/i.test(x)) {
      return "klassieke-talen";
    } else if (/kunst.*cultuur/i.test(x)) {
      return "kunst-en-cultuur";
    } else if (/moderne.*talen/i.test(x)) {
      return "moderne-talen";
    } else if (/sociale.*wetenschappen/i.test(x)) {
      return "sociale-wetenschappen";
    } else if (/stem/i.test(x)) {
      return "stem";
    } else if (/wiskunde/i.test(x)) {
      return "wiskunde";
    } else {
      return { error: `Unsupported Wetenschapsdomein entry: "${x}"` };
    }
  },
  "Nummer / Code": x => {
    if (/[0-9]/.test(x)) {
      return x.replace(/\*/g, "s").replace(/\.$/, "")
    } else {
      return { error: `Not a Nummer / Code: "${x}"` };
    }
  }
}

// The keys correspond to the sheetnames in the lookup Excel file
const relatedColumnsInfo = {
  "L-LG": {
    "inputColumnHeaders": ["Indeling"],
    "outputColumnHeader": "Verwant leergebied",
    "ondnivColumnHeader": "Onderwijsniveau_id"
  },
  "L-SD-generic": {
    "exclude": /^Frans/i,
    "inputColumnHeaders": ["Indeling", "Titel 1"],
    "outputColumnHeader": "Verwant subdomein",
    "ondnivColumnHeader": "Onderwijsniveau_id"
  },
  "L-SD-frans": {
    "include": /^Frans/i,
    "inputColumnHeaders": ["Indeling", "Titel 2"],
    "outputColumnHeader": "Verwant subdomein",
    "ondnivColumnHeader": "Onderwijsniveau_id"
  },
  "L-TH": {
    "exclude": /^Frans/i,
    "inputColumnHeaders": ["Indeling", "Titel 2"],
    "outputColumnHeader": "Verwant thema",
    "ondnivColumnHeader": "Onderwijsniveau_id"
  },
  "S-SL": {
    "inputColumnHeaders": ["Sleutelcompetentie"],
    "outputColumnHeader": "Verwante sleutelcompetentie",
    "ondnivColumnHeader": "Onderwijsniveau_id"
  },
  "S-BS": {
    "inputColumnHeaders": ["Sleutelcompetentie", "Onderdeel"],
    "outputColumnHeader": "Verwante bouwsteen",
    "ondnivColumnHeader": "Onderwijsniveau_id"
  },
  "S-WD": {
    "inputColumnHeaders": ["Wetenschapsdomein"],
    "outputColumnHeader": "Verwant wetenschapsdomein",
    "ondnivColumnHeader": "Onderwijsniveau_id"
  }
}

class PrepareOnderwijsdoelenToolbox {
  /**
   * Constuctor
   * @logger An existing winston logger
   */
  constructor(logger) {
    this.logger = logger;
  }

  /**
   * Add columns Id, Verwant... and fill them with a unique value derived from other columns
   * @param onlySheet restrict processing to sheet with this name
   * @private
   */
  _addColumnsIdVerwantEtc(onlySheet) {
    if (this.workbook) {
      this.workbook.eachSheet(function (worksheet, sheetId) {
        if (!onlySheet || worksheet.name === onlySheet) {
          this.logger.info(`Adding columns Id, Verwant... in worksheet "${worksheet.name}"`);
          const firstRow = worksheet.getRow(1);
          const hc = getHeadersColumnNumbers(firstRow, this.logger);
          // collect headers for Id in the order we need them
          const orderedHeadersForId = [];
          columnHeadersToConsiderForId.forEach(header => {
            if (hc.hasOwnProperty(header)) {
              orderedHeadersForId.push(header);
            }
          });
          const orderedOndNivHeadersForId = [];
          columnHeadersToConsiderForOndNivId.forEach(header => {
            if (hc.hasOwnProperty(header)) {
              orderedOndNivHeadersForId.push(header);
            }
          });
          this.logger.info(`Using column headers for Id: ${orderedHeadersForId.join(", ")}`);
          this.logger.info(`Using column headers for OndNiv Id: ${orderedOndNivHeadersForId.join(", ")}`);
          // collect available input for related columns
          const relatedColumnsInfoKeysToUse = [];
          for (const [key, info] of Object.entries(relatedColumnsInfo)) {
            let usable = true;
            for (const h of info["inputColumnHeaders"]) {
              if (!hc.hasOwnProperty(h)) {
                usable = false;
                break;
              }
            }
            if (usable) {
              relatedColumnsInfoKeysToUse.push(key);
            }
          }
          if (this.logger.isInfoEnabled()) {
            const usedHeaders = new Set();
            for (const key of relatedColumnsInfoKeysToUse) {
              for (const header of relatedColumnsInfo[key]["inputColumnHeaders"]) {
                usedHeaders.add(header);
              }
            }
            this.logger.info(`Using column headers for related concepts: ${Array.from(usedHeaders).join(", ")}`);
          }

          // Add columns this way and not using worksheet.spliceColumns(); the latter sometimes corrupts the Excel file...
          let hcEx = addColumnWithHeader(firstRow, "Id", this.logger);
          const relatedColumnHeadersAdded = [];
          for (const key of relatedColumnsInfoKeysToUse) {
            let header = relatedColumnsInfo[key]["ondnivColumnHeader"];
            if (!relatedColumnHeadersAdded.includes(header)) {
              hcEx = addColumnWithHeader(firstRow, header, this.logger);
              relatedColumnHeadersAdded.push(header);
            }
            header = relatedColumnsInfo[key]["outputColumnHeader"];
            if (!relatedColumnHeadersAdded.includes(header)) {
              hcEx = addColumnWithHeader(firstRow, header, this.logger);
              relatedColumnHeadersAdded.push(header);
            }
          }
          // now fill the new columns row per row
          worksheet.eachRow(function (row, rowNumber) {
            if (rowNumber > 1) {
              let id = "";
              let faulty = false;
              orderedHeadersForId.forEach(header => {
                if (!faulty) {
                  let txt = getRowValueAtHeader(hcEx, row, header, this.logger);
                  if (txt) {
                    let r = transformationsForId[header](txt);
                    if (typeof (r) != "string") {
                      this.logger.warn(`No Id for row ${rowNumber} because: ${r.error}`);
                      id = "";
                      faulty = true;
                    } else {
                      let s = slugify(r);
                      if (s.length > 0) {
                        if (id.length > 0) {
                          id = id + "-" + s;
                        } else {
                          id = s;
                        }
                      }
                    }
                  }
                }
              });
              let ondnivId = "";
              orderedOndNivHeadersForId.forEach(header => {
                if (!faulty) {
                  let txt = getRowValueAtHeader(hcEx, row, header, this.logger);
                  if (txt) {
                    let r = transformationsForId[header](txt);
                    if (typeof (r) != "string") {
                      this.logger.warn(`No Id for row ${rowNumber} because: ${r.error}`);
                      ondnivId = "";
                      faulty = true;
                    } else {
                      let s = slugify(r);
                      if (s.length > 0) {
                        if (ondnivId.length > 0) {
                          ondnivId = ondnivId + "-" + s;
                        } else {
                          ondnivId = s;
                        }
                      }
                    }
                  }
                }
              });
              setRowValueAtHeader(hcEx, row, "Id", id, this.logger);
              this.logger.debug(`Id: ${id}`);
              for (const key of relatedColumnsInfoKeysToUse) {
                const info = relatedColumnsInfo[key];
                setRowValueAtHeader(hcEx, row, info["ondnivColumnHeader"], `http://ilearn.ilabt.imec.be/vocab/ondniv/${ondnivId}`, this.logger);
                const texts = [];
                for (const header of info["inputColumnHeaders"]) {
                  texts.push(getRowValueAtHeader(hcEx, row, header, this.logger));
                }
                const txt = texts.join("|");
                if (txt) {
                  if (info["include"] && !txt.match(info["include"])) {
                    this.logger.debug(`"${key}", not included: "${txt}"`);
                  } else if (info["exclude"] && txt.match(info["exclude"])) {
                    this.logger.debug(`"${key}", excluded: "${txt}"`);
                  } else {
                    const related = this.lookup[key][txt];
                    if (related) {
                      const header = info["outputColumnHeader"];
                      setRowValueAtHeader(hcEx, row, header, related, this.logger);
                      this.logger.debug(`"${key}", added: "${header}" --> "${related}"`);
                    }
                  }
                }
              }
            }
          }.bind(this));
        }
      }.bind(this));
    } else {
      this.logger.error(`No workbook available`);
    }
  }

  /**
   * Format cells to get a better overview (given the multi-line cells)
   * @param onlySheet restrict processing to sheet with this name
   * @private
   */
  _formatCellsForMultilineCells(onlySheet) {
    if (this.workbook) {
      this.workbook.eachSheet(function (worksheet, sheetId) {
        if (!onlySheet || worksheet.name === onlySheet) {
          this.logger.info(`Formatting cells in worksheet "${worksheet.name}"`);
          worksheet.eachRow(function (row, rowNumber) {
            if (rowNumber > 1) {
              row.height = 15;
            }
            row.eachCell(function (cell, colNumber) {
              cell.alignment = { wrapText: false, horizontal: "left" };
            }.bind(this));
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
   * Read lookup info from Excel file
   * @param filenameLookup name of the Excel file containing lookup tables
   */
  async readLookup(filenameLookup) {
    const lookupWorkbook = new ExcelJS.Workbook();
    await lookupWorkbook.xlsx.readFile(filenameLookup);
    deleteHeaderlessColumns(lookupWorkbook, "", this.logger);
    cleanText(lookupWorkbook, "", this.logger);
    this.lookup = {};
    const translations = {};
    for (const relatedColumnsInfoKey of Object.keys(relatedColumnsInfo)) {
      const worksheet = lookupWorkbook.getWorksheet(relatedColumnsInfoKey);
      if (worksheet) {
        const firstRow = worksheet.getRow(1);
        const hc = getHeadersColumnNumbers(firstRow, this.logger);
        if (hc.hasOwnProperty("text-related") && hc.hasOwnProperty("concept")) {
          this.logger.info(`Filling lookup for ${relatedColumnsInfoKey}`);
          worksheet.eachRow(function (row, rowNumber) {
            if (rowNumber > 1) {
              for (const h of Object.keys(hc).filter(h => h.startsWith("text-related"))) {
                const input = getRowValueAtHeader(hc, row, h, this.logger);
                const related = getRowValueAtHeader(hc, row, "concept", this.logger);
                if (input && related && !translations[input]) {
                  translations[input] = related;
                  this.logger.debug(`Lookup: ${input} --> ${related}`);
                }
              }
            }
          }.bind(this));
        } else {
          this.logger.error(`Columns "text-related" and/or "concept" missing in worksheet ${worksheet.name}`);
        }
      }
      this.lookup[relatedColumnsInfoKey] = translations;
    }
  }

  /**
   * Process the contents
   * @param onlySheet restrict processing to sheet with this name
   */
  process(onlySheet) {
    deleteHeaderlessColumns(this.workbook, onlySheet, this.logger);
    cleanText(this.workbook, onlySheet, this.logger);
    this._addColumnsIdVerwantEtc(onlySheet);
    this._formatCellsForMultilineCells(onlySheet);
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
  const program = new commander.Command();
  program
    .requiredOption("-i, --input <filename>", "Input Excel file (*.xlsx)")
    .option("-s, --sheet <sheetname>", "If given, handle this sheet only", "")
    .requiredOption("-u, --lookup <filename>", "Lookup Excel file (*.xlsx)")
    .requiredOption("-o, --output <filename>", "Output file (*.xlsx or *.csv)")
    .option("-c, --csv", "Output as CSV instead of XLSX?")
    .addOption(new commander.Option("-l, --log <level>", "Logging level").choices(["error", "warn", "info", "verbose", "debug", "silly"]).default("warn"))
    .parse(process.argv);
  const options = program.opts();
  const logger = createLogger(options.log);
  const box = new PrepareOnderwijsdoelenToolbox(logger);
  await box.read(options.input);
  await box.readLookup(options.lookup);
  box.process(options.sheet);
  await box.write(options.output, options.csv, options.sheet);
})();