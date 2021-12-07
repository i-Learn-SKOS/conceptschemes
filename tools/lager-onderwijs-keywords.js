/**
 * This tool's target is to create a Turtle file for keywords, lager onderwijs.
 *
 * This is a Q&D project.
 */

const commander = require("commander");
const ExcelJS = require('exceljs');
const fs = require('fs');
const createLogger = require("./create-logger");
const {slugify} = require("./utils-generic");
const {deleteHeaderlessColumns, cleanText, getHeadersColumnNumbers, getRowValueAtHeader, setRowValueAtHeader} = require("./utils-exceljs");

// prefixes (without trailing ':')
const elementsPrefix = "elem";
const curriculumPrefix = "curr2";
const keywordsPrefix = "tref2";
const skosPrefix = "skos";

// URIs used per prefix
const elementsUris = {
  lagerOnderwijs: `${elementsPrefix}:lager-onderwijs`,
  trefwoorden: `${elementsPrefix}:trefwoorden`
}
const keywordsUris = {
  _scheme: `${keywordsPrefix}:_scheme`,
}
const skosUris = {
  Concept: `${skosPrefix}:Concept`,
  ConceptScheme: `${skosPrefix}:ConceptScheme`,
  inScheme: `${skosPrefix}:inScheme`,
  topConceptOf: `${skosPrefix}:topConceptOf`,
  prefLabel: `${skosPrefix}:prefLabel`,
  altLabel: `${skosPrefix}:altLabel`,
  related: `${skosPrefix}:related`,
  member: `${skosPrefix}:member`
}

// all keys are supported as headers, but also headers starting with a key are allowed, example: AltLabel2
const supportedHeadersStartPredicates = {
  "PrefLabel": skosUris.prefLabel,
  "AltLabel": skosUris.altLabel,
  "Related": skosUris.related
}


class LagerOnderwijsKeywordsToolbox {
  /**
   * Constuctor
   * @logger An existing winston logger
   */
  constructor(logger) {
    this.logger = logger;
    this.data = {};
  }

  /**
   * How we sort here
   * @param a
   * @param b
   * @returns {number}
   * @private
   */
  static _mySort(a, b) {
    return a.localeCompare(b, 'en', { sensitivity: 'base' });
  }

  /**
   * Add a concept to this object
   * @param concept the concept (whose predicates are Sets)
   * @param slug
   * @private
   */
  _addConcept(concept, slug) {
    if (this.data.hasOwnProperty(slug)) {
      const previousConcept = this.data[slug];
      this.logger.info(`Merging new concept ${slug} into existing one`);
      for (const predicate in concept) {
        if (previousConcept.hasOwnProperty(predicate)) {
          previousConcept[predicate] = new Set([...previousConcept[predicate], ...concept[predicate]]);
        } else {
          previousConcept[predicate] = concept[predicate];
        }
      }
    } else {
      this.logger.info(`Adding new concept "${slug}"`);
      this.data[slug] = concept;
    }
  }

  /**
   * Read info from one Excel file into this object
   * @param filename name of the Excel file
   */
  async addFromExcelFile(filename) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filename);
    deleteHeaderlessColumns(workbook, "", this.logger);
    cleanText(workbook, "", this.logger);

    workbook.eachSheet(function(worksheet, sheetId) {
      // get headers and corresponding predicates
      const headersPredicatesToUse = {};
      let prefLabelHeaderFound = false;
      const firstRow = worksheet.getRow(1);
      const hc = getHeadersColumnNumbers(firstRow, this.logger);
      for (const [header, colNumber] of Object.entries(hc)) {
        const headerStart = Object.keys(supportedHeadersStartPredicates).find(k => header.startsWith(k));
        if (headerStart !== undefined) {
          const predicate = supportedHeadersStartPredicates[headerStart];
          if (headerStart === "PrefLabel") {
            if (prefLabelHeaderFound) {
              this.logger.warn(`Skipping header "${header}" of worksheet "${worksheet.name}" (only one PrefLabel allowed)`);
            } else {
              headersPredicatesToUse[header] = predicate;
              prefLabelHeaderFound = true;
            }
          } else {
            headersPredicatesToUse[header] = predicate;
          }
        } else {
          this.logger.warn(`Skipping unsupported header "${header}" at the top of column ${colNumber} of worksheet "${worksheet.name}"`);
        }
      }
      this.logger.info(`Using columns in worksheet "${worksheet.name}" with headers ${Object.keys(headersPredicatesToUse).join(", ")}`);
      // sheet is only valid if PrefLabel column is present
      if (prefLabelHeaderFound) {
        worksheet.eachRow(function(row, rowNumber) {
          if (rowNumber > 1) {
            const concept = {};
            let slug = "";
            for (const [header, predicate] of Object.entries(headersPredicatesToUse)) {
              const v = getRowValueAtHeader(hc, row, header, this.logger);
              if (v) {
                if (predicate == skosUris.prefLabel) {
                  slug = slugify(v);
                }
                if (!concept.hasOwnProperty((predicate))) {
                  concept[predicate] = new Set();
                }
                if (predicate.endsWith("Label")) {
                  concept[predicate].add(`"${v}"@nl`);
                } else {
                  concept[predicate].add(v);
                }
              }
            }
            if (slug) {
              this._addConcept(concept, slug);
            } else {
              this.logger.warn(`Skipping concept in row ${rowNumber} of worksheet "${worksheet.name}" (no ${skosUris.prefLabel})`);
            }
          }
        }.bind(this));
      } else {
        this.logger.warn(`Skipping entire worksheet "${worksheet.name}" (no PrefLabel column found)`);
      }
    }.bind(this));
  }

  /**
   * Get turtle representation of the available data.
   *
   * The output here may contain some hardcoded stuff :-) :-) :-)
   */
  getTurtle() {
    let ret = `##########################################################################
# This file contains keyword concepts applicable to LAGER ONDERWIJS only #
#                                                                        #
# It was created with the lager-onderwijs-tool.                          #
##########################################################################
@prefix ${keywordsPrefix}: <http://ilearn.ilabt.imec.be/vocab/${keywordsPrefix}/> .
@prefix ${curriculumPrefix}: <http://ilearn.ilabt.imec.be/vocab/${curriculumPrefix}/> .
@prefix ${elementsPrefix}: <http://ilearn.ilabt.imec.be/vocab/${elementsPrefix}/> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix ${skosPrefix}: <http://www.w3.org/2004/02/skos/core#> .

<http://ilearn.ilabt.imec.be/vocab/${keywordsPrefix}/> a owl:Ontology .

${keywordsUris._scheme} a ${skosUris.ConceptScheme} ;
  ${skosUris.prefLabel} "trefwoorden lager onderwijs"@nl .

`;

    const slugs = Object.keys(this.data).sort(this._mySort);
    for (const slug of slugs) {
      ret += `${keywordsPrefix}:${slug} a ${skosUris.Concept} ;
  ${skosUris.inScheme} ${keywordsUris._scheme} ;
  ${skosUris.topConceptOf} ${keywordsUris._scheme}`;
      const concept = this.data[slug];
      const predicates = Object.keys(concept).sort(this._mySort);
      for (const predicate of predicates) {
        const values = Array.from(concept[predicate]).sort(this._mySort);
        let first = true;
        for (const value of values) {
          if (first) {
            ret += ` ;
  ${predicate} ${value}`;
            first = false;
          } else {
            ret += `,
    ${value}`;
          }
        }
      }
    ret += ` .
${elementsUris.lagerOnderwijs} ${skosUris.member} ${keywordsPrefix}:${slug} .
${elementsUris.trefwoorden} ${skosUris.member} ${keywordsPrefix}:${slug} .

`;
    }
    return ret;
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
    .requiredOption("-o, --output <filename>", "Output Turtle file (*.ttl)")
    .addOption(new commander.Option("-l, --log <level>", "Logging level").choices(["error", "warn", "info", "verbose", "debug", "silly"]).default("warn"))
    .parse(process.argv);
  const options = program.opts();
  const logger = createLogger(options.log);
  const box = new LagerOnderwijsKeywordsToolbox(logger);
  await box.addFromExcelFile(options.input);
  await fs.writeFileSync(options.output, box.getTurtle());
})();
