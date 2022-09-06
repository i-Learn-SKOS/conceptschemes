/**
 * A tool to make overviews from deployed concept schemes, using GraphQL-LD queries.
 *
 * Do not change this tool for continuity reasons (../overviews folder!)
 *
 * See https://github.com/rubensworks/graphql-ld-comunica.js for implementation documentation.
 */

const Client = require("graphql-ld").Client;
const QueryEngineComunica = require("graphql-ld-comunica").QueryEngineComunica;
const LoggerPretty = require("@comunica/logger-pretty").LoggerPretty;
const commander = require("commander");

class QueryToolbox {
  /**
   * Constuctor
   * @param logLevel the logging level for comunica
   */
  constructor(logLevel) {
    const comunicaConfig = {
      sources: [{type: "sparql", value: "https://ilearn-dev.ilabt.imec.be/skosmos/sparql"}],
      log: new LoggerPretty({level: logLevel})
    };
    this.queryEngine = new QueryEngineComunica(comunicaConfig);

    this.commonContextEntries = {
      "id": "@id",

      // rdf
      "TYPE": {"@id": "http://www.w3.org/1999/02/22-rdf-syntax-ns#type"},

      // skos types
      "ConceptScheme": {"@id": "http://www.w3.org/2004/02/skos/core#ConceptScheme"},
      "Collection": {"@id": "http://www.w3.org/2004/02/skos/core#Collection"},
      "Concept": {"@id": "http://www.w3.org/2004/02/skos/core#Concept"},

      // skos predicates
      "prefLabel": {"@id": "http://www.w3.org/2004/02/skos/core#prefLabel", "@language": "nl"},
      "altLabel": {"@id": "http://www.w3.org/2004/02/skos/core#altLabel", "@language": "nl"},
      "hiddenLabel": {"@id": "http://www.w3.org/2004/02/skos/core#hiddenLabel", "@language": "nl"},
      "definition": {"@id": "http://www.w3.org/2004/02/skos/core#definition", "@language": "nl"},
      "topConceptOf": {"@id": "http://www.w3.org/2004/02/skos/core#topConceptOf"},
      "inScheme": {"@id": "http://www.w3.org/2004/02/skos/core#inScheme"},
      "member": {"@id": "http://www.w3.org/2004/02/skos/core#member"},
      "broader": {"@id": "http://www.w3.org/2004/02/skos/core#broader"},
      "narrower": {"@id": "http://www.w3.org/2004/02/skos/core#narrower"},
      "related": {"@id": "http://www.w3.org/2004/02/skos/core#related"},

      // skos, reverse predicates
      "memberOf": {"@reverse": "http://www.w3.org/2004/02/skos/core#member"},
      "schemeHas": {"@reverse": "http://www.w3.org/2004/02/skos/core#inScheme"},

      // skosxl types
      "LabelSkosxl": {"@id": "http://www.w3.org/2008/05/skos-xl#Label"},

      // skosxl predicates
      "altLabelSkosxl": {"@id": "http://www.w3.org/2008/05/skos-xl#altLabel"},
      "literalFormSkosxl": {"@id": "http://www.w3.org/2008/05/skos-xl#literalForm"},

      // dct predicates
      "typeDct": {"@id": "http://purl.org/dc/terms/type"},

      // publications.eu label types
      "SHORTLABEL": {"@id": "http://publications.europa.eu/resource/authority/label-type/SHORTLABEL"}
    };
  }

  /**
   * Do the query
   * @param context the context
   * @param query the query
   * @returns query result
   * @private
   */
  async _query(context, query) {
    const client = new Client({context, queryEngine: this.queryEngine});
    const data = await client.query({query});
    return data.data;
  }

  /**
   * Add an id to queryResult[0]
   * @param queryResult the queryResult; an array with 1 element
   * @param id the value of the id to be added
   * @returns the augmented query result
   * @private
   */
  _addIdToQueryResult(queryResult, id) {
    if (Array.isArray(queryResult) && queryResult.length === 1) {
      queryResult[0] = {...{"id": id}, ...queryResult[0]};
    }
    return queryResult;

  }
  /**
   * Queries all available concept schemes. This function is provided for illustrating/debugging purposes only.
   * @returns array of objects, each object having limited info about one concept scheme
   */
  async queryConceptSchemes() {
    const context = {"@context": {...this.commonContextEntries}};
    const query = `
      {
        TYPE(_:ConceptScheme)
        id @single
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
        definition @single @optional
      }`;
    return await this._query(context, query);
  }

  /**
   * Queries one concept scheme. This function is provided for illustrating/debugging purposes only.
   * @param conceptSchemeUri URI of the concept scheme
   * @returns object, having full info about the concept scheme
   */
  async queryConceptScheme(conceptSchemeUri) {
    const context = {"@context": {...this.commonContextEntries}};
    context["@context"]["ID"] = conceptSchemeUri
    const query = `
      {
        TYPE(_:ConceptScheme)
        id(_:ID)
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
        definition @single @optional
        schemeHasConcept: schemeHas(type: Concept) @optional {
          id @single
          prefLabel @single
          altLabel @optional
          hiddenLabel @optional
          definition @single @optional
        }
        schemeHasCollection: schemeHas(type: Collection) @optional {
          id @single
          prefLabel @single
          altLabel @optional
          hiddenLabel @optional
          definition @single @optional
        }
      }`;
    return this._addIdToQueryResult(await this._query(context, query), conceptSchemeUri);
  }

  /**
   * Queries all available collections.
   * @returns array of objects, each object having limited info about one collection
   */
  async queryCollections() {
    const context = {"@context": {...this.commonContextEntries}};
    const query = `
      {
        TYPE(_:Collection)
        id @single
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
        definition @single @optional
      }`;
    return await this._query(context, query);
  }

  /**
   * Queries one collection.
   * @param collectionUri URI of the collection
   * @returns object, having full info about the collection
   */
  async queryCollection(collectionUri) {
    const context = {"@context": {...this.commonContextEntries}};
    context["@context"]["ID"] = collectionUri;
    const query = `
      {
        TYPE(_:Collection)
        id(_:ID) @single
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
        definition @single @optional
        member @optional {
          id @single
          prefLabel @single
          altLabel @optional
          hiddenLabel @optional
          definition @single @optional
        }
      }`;
    return this._addIdToQueryResult(await this._query(context, query), collectionUri);
  }

  /**
   * Queries all available concepts.
   * @param restrictToCollectionUri restrict output to members of this optional collection
   * @returns array of objects, each object having limited info about one concept
   */
  async queryConcepts(restrictToCollectionUri) {
    const context = {"@context": {...this.commonContextEntries}};
    let restriction = "";
    if (restrictToCollectionUri) {
      context["@context"]["ID_R"] = restrictToCollectionUri;
      restriction = "memberOf(_:ID_R)";
    }
    const query = `
      {
        ${restriction}
        TYPE(_:Concept)
        id @single
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
        definition @single @optional
      }`;
    return await this._query(context, query);
  }

  /**
   * Queries one concept.
   * @param conceptUri URI of the concept
   * @returns object, having full info about the concept
   */
  async queryConcept(conceptUri) {
    const context = {"@context": {...this.commonContextEntries}};
    context["@context"]["ID"] = conceptUri;
    const query = `
      {
        TYPE(_:Concept)
        id(_:ID) @single
        ... conceptFields
        memberOf @optional {
          id @single
          ... collectionFields
        }
        broader @optional {
          id @single
          ... conceptFields
        }
        narrower @optional {
          id @single
          ... conceptFields
        }
        related @optional {
          id @single
          ... conceptFields
        }
      }
      
      fragment collectionFields on Collection {
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
      }
      
      fragment conceptFields on Concept {
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
        definition @single @optional
      }`;
    return this._addIdToQueryResult(await this._query(context, query), conceptUri);
  }

  /**
   * Queries for a top-down (or "hierarchical") overview, for concepts in a concept scheme.
   * @param conceptSchemeUri URI of the concept scheme
   * @param restrictTopToCollection restrict output to only start from concepts members of this optional collection
   * @param restrictToCollectionUri restrict output to members of this optional collection
   * @returns object, having the overview
   */
  async queryTopDownOverview(conceptSchemeUri, restrictTopToCollection, restrictToCollectionUri) {
    const context = {"@context": {...this.commonContextEntries}};
    context["@context"]["ID"] = conceptSchemeUri;
    let topRestriction = "";
    if (restrictTopToCollection) {
      context["@context"]["ID_RT"] = restrictTopToCollection;
      topRestriction = "memberOf(_:ID_RT)";
    }
    let restriction = "";
    if (restrictToCollectionUri) {
      context["@context"]["ID_R"] = restrictToCollectionUri;
      restriction = "memberOf(_:ID_R)";
    }
    const query = `
      {
        ${topRestriction}
        id @single
        inScheme(_:ID) @single
        ... conceptFields
        narrower @optional {
          ${restriction}
          id @single
          ... conceptFields
          narrower @optional {
            ${restriction}
            id @single
            ... conceptFields
            narrower @optional {
              ${restriction}
              id @single
              ... conceptFields
              # five levels is enough...
              narrower @optional {
                ${restriction}
                id @single
                ... conceptFields
              }
            }
          }
        }
      }
      
      fragment conceptFields on Concept {
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
        definition @single @optional
        memberOf @optional
        altLabelSkosxl @optional @single {
          literalFormSkosxl @single
          typeDct(_:SHORTLABEL)
        }
      }`;
    return await this._query(context, query);
  }

  /**
   * Queries for an overview of concepts and their related concepts.
   * @param conceptSchemeUri URI of the concept scheme of the related concepts
   * @param restrictToCollectionUri restrict output to members of this optional collection
   * @returns object, having the overview
   */
  async queryRelatedOverview(conceptSchemeUri, restrictToCollectionUri) {
    const context = {"@context": {...this.commonContextEntries}};
    context["@context"]["ID"] = conceptSchemeUri;
    let restriction = "";
    if (restrictToCollectionUri) {
      context["@context"]["ID_R"] = restrictToCollectionUri;
      restriction = "memberOf(_:ID_R)";
    }
    const query = `
      {
        ${restriction}
        id @single
        ... conceptFields
        related {
          id @single
          inScheme(_:ID) @single
          ... conceptFields
        }
      }
      
      fragment conceptFields on Concept {
        prefLabel @single
        altLabel @optional
        hiddenLabel @optional
        definition @single @optional
        memberOf @optional
      }`;
    return await this._query(context, query);
  }
}

/**
 * Print a query result's data
 * @param obj the query result
 * @param descr a description for the object (start with upper case letter)
 */
function printData(obj, descr = "") {
  if (descr) {
    console.log(`${descr}:`);
  }
  console.log(JSON.stringify(obj, null, 2))
}

/**
 * Print a count of elements in an array
 * @param arr the array
 * @param descr a description for the count (start with lower case letter)
 */
function printCount(arr, descr = "") {
  console.log(`Counted ${arr && Array.isArray(arr) ? arr.length : 0} ${descr}.`);
}

/**
 * Start
 */
(async function main() {
  // command line
  const program= new commander.Command();
  program
    .addOption(new commander.Option("--schemes", "query all concept schemes (summary)"))
    .addOption(new commander.Option("--collections", "query all collections (summary)"))
    .addOption(new commander.Option("--concepts", "query all concepts (summary)"))
    .addOption(new commander.Option("--scheme <schemeURI>", "query one concept scheme (detailed)"))
    .addOption(new commander.Option("--collection <collectionURI>", "query one collection (detailed)"))
    .addOption(new commander.Option("--concept <conceptURI>", "query one concept (detailed)"))
    .addOption(new commander.Option("--top-down <schemeURI>", "query a top-down (or 'hierarchical') overview of a concept scheme"))
    .addOption(new commander.Option("--related <schemeURI>", "query an overview of concepts and their related concepts that are in a given concept scheme"))
    .addOption(new commander.Option("--restrict-to-collection <collectionURI>", "restrict output to concepts member of given collection"))
    .addOption(new commander.Option("--restrict-top-to-collection <collectionURI>", "restrict output of top-down overview to start only from concepts member of given collection"))
    .addOption(new commander.Option("-l, --log <level>", "logging level for Comunica's query engine").choices(["error", "warn", "info", "verbose", "debug", "trace"]).default("error"))
    .parse(process.argv);
  const options = program.opts();

  const box = new QueryToolbox(options.log);

  if (options.schemes) {
    const queriedConceptSchemes = await box.queryConceptSchemes();
    printData(queriedConceptSchemes, `Concept schemes`);
    printCount(queriedConceptSchemes, `concept scheme(s)`);
  }

  if (options.scheme) {
    const conceptSchemeUri = options.scheme;
    const queriedConceptScheme = await box.queryConceptScheme(conceptSchemeUri);
    printData(queriedConceptScheme, `Concept scheme ${conceptSchemeUri}`);
    printCount(queriedConceptScheme[0].schemeHasConcept, `Concept(s) in concept scheme ${conceptSchemeUri}`);
    printCount(queriedConceptScheme[0].schemeHasCollection, `Collection(s) in concept scheme ${conceptSchemeUri}`);
  }

  if (options.collections) {
    const queriedCollections = await box.queryCollections();
    printData(queriedCollections, `Collections`);
    printCount(queriedCollections, `collection(s)`);
  }

  if (options.collection) {
    const collectionUri = options.collection;
    const queriedCollection = await box.queryCollection(collectionUri);
    printData(queriedCollection, `Collection ${collectionUri}`);
    printCount(queriedCollection[0].member, `member(s) in collection ${collectionUri}`);
  }

  if (options.concepts) {
    const queriedConcepts = await box.queryConcepts(options.restrictToCollection);
    printData(queriedConcepts, `Concepts`);
    printCount(queriedConcepts, `concept(s)`);
  }

  if (options.concept) {
    const conceptUri = options.concept;
    const queriedConcept = await box.queryConcept(conceptUri);
    printData(queriedConcept, `Concept ${conceptUri}`);
    printCount(queriedConcept[0].broader, `broader concept(s) for ${conceptUri}`);
    printCount(queriedConcept[0].narrower, `broader concept(s) for ${conceptUri}`);
    printCount(queriedConcept[0].related, `related concept(s) for ${conceptUri}`);
    printCount(queriedConcept[0].memberOf, `collection(s) containing ${conceptUri}`);
  }

  if (options.topDown) {
    const overview = await box.queryTopDownOverview(options.topDown, options.restrictTopToCollection, options.restrictToCollection);
    printData(overview);
  }

  if (options.related) {
    const overview = await box.queryRelatedOverview(options.related, options.restrictToCollection);
    printData(overview);
  }
})();
