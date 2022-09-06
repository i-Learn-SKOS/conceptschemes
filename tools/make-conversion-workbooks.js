/**
 * A tool to make conversion workbooks
 */

const QueryEngine  = require('@comunica/query-sparql-file').QueryEngine ;
const myEngine = new QueryEngine();
const path = require('path');
const ExcelJS = require('exceljs');

async function doQuery(title, queryString, columns, fileIn, fileOut) {
  const bindingsStream = await myEngine.queryBindings(queryString,  {
      sources: [path.resolve(fileIn)]
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(title);
  sheet.addRow(columns);

  // Consume results as a stream (best performance)
  bindingsStream.on('data', (binding) => {
    sheet.addRow([binding.get(columns[0]).value, binding.get(columns[1]).value]);
  });
  bindingsStream.on('end', async () => {
    await workbook.xlsx.writeFile(path.resolve(fileOut));
    console.log('Query done');
  });
  bindingsStream.on('error', (error) => {
    console.error(error);
  });
}

(async function main() {
  // ConceptSchemes old and new
  doQuery("Old conceptschemes", `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?uri ?prefLabel WHERE {
      ?uri a skos:ConceptScheme .
      ?uri skos:prefLabel ?prefLabel .
    }
    ORDER BY ?uri`, ["uri", "prefLabel"],
    '../conversion/local-ondniv-to-common-onderwijsstructuur/ondniv-old.ttl',
    `../conversion/local-ondniv-to-common-onderwijsstructuur/conceptschemes-old.xlsx`);
  doQuery("New conceptschemes", `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?uri ?prefLabel WHERE {
      ?uri a skos:ConceptScheme .
      ?uri skos:prefLabel ?prefLabel .
    }
    ORDER BY ?uri`, ["uri", "prefLabel"],
    '../schemes/onderwijsstructuur-final.skos.ttl',
    `../conversion/local-ondniv-to-common-onderwijsstructuur/conceptschemes-new.xlsx`);

  // Collections old and new (old ones to fetch from elem-old.ttl!)
  doQuery("Old collections", `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?uri ?prefLabel WHERE {
      ?uri a skos:Collection .
      ?uri skos:prefLabel ?prefLabel .
    }
    ORDER BY ?uri`, ["uri", "prefLabel"],
    '../conversion/local-ondniv-to-common-onderwijsstructuur/elem-old.ttl',
    `../conversion/local-ondniv-to-common-onderwijsstructuur/collections-old.xlsx`);
  doQuery("New collections", `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?uri ?prefLabel WHERE {
      ?uri a skos:Collection .
      ?uri skos:prefLabel ?prefLabel .
    }
    ORDER BY ?uri`, ["uri", "prefLabel"],
    '../schemes/onderwijsstructuur-final.skos.ttl',
    `../conversion/local-ondniv-to-common-onderwijsstructuur/collections-new.xlsx`);

  // Concepts old and new
  doQuery("Old concepts", `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?uri ?prefLabel WHERE {
      ?uri a skos:Concept .
      ?uri skos:prefLabel ?prefLabel .
    }
    ORDER BY ?uri`, ["uri", "prefLabel"],
    '../conversion/local-ondniv-to-common-onderwijsstructuur/ondniv-old.ttl',
    `../conversion/local-ondniv-to-common-onderwijsstructuur/concepts-old.xlsx`);
  doQuery("New concepts", `
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    SELECT ?uri ?prefLabel WHERE {
      ?uri a skos:Concept .
      ?uri skos:prefLabel ?prefLabel .
    }
    ORDER BY ?uri`, ["uri", "prefLabel"],
    '../schemes/onderwijsstructuur-final.skos.ttl',
    `../conversion/local-ondniv-to-common-onderwijsstructuur/concepts-new.xlsx`);

})();
