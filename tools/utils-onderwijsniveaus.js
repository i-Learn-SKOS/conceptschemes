/**
 * This file contains some utilities on onderwijsniveaus
 */

// This is the ["@graph"][0]["member"] array taken from the output of test-graphql-ld-queries.js#testOnderwijsNiveaus().
// Update when onderwijsniveaus info changes!
onderwijsNiveaus = [
  {
    "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis",
    "topConceptOf": "http://ilearn.ilabt.imec.be/vocab/ondniv/_scheme",
    "prefLabel": "basisonderwijs",
    "narrower": [
      {
        "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-kleuter",
        "prefLabel": "kleuteronderwijs",
        "narrower": [
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-kleuter-3j",
            "prefLabel": "3 jaar of jonger"
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-kleuter-4j",
            "prefLabel": "4 jaar"
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-kleuter-5j",
            "prefLabel": "5 jaar"
          }
        ]
      },
      {
        "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-lager",
        "prefLabel": "lager onderwijs",
        "narrower": [
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-lager-lj1",
            "prefLabel": "1ste leerjaar"
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-lager-lj2",
            "prefLabel": "2e leerjaar"
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-lager-lj3",
            "prefLabel": "3e leerjaar"
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-lager-lj4",
            "prefLabel": "4e leerjaar"
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-lager-lj5",
            "prefLabel": "5e leerjaar"
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-lager-lj6",
            "prefLabel": "6e leerjaar"
          }
        ]
      }
    ]
  },
  {
    "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec",
    "narrower": [
      {
        "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr1",
        "prefLabel": "1ste graad",
        "narrower": [
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr1-astroom",
            "prefLabel": "a-stroom"
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr1-bstroom",
            "prefLabel": "b-stroom"
          }
        ]
      },
      {
        "narrower": [
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-arbeidsmarkt",
            "prefLabel": "finaliteit arbeidsmarkt",
            "narrower": [
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-arbeidsmarkt-bso",
                "prefLabel": "bso"
              }
            ]
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-doorstroom",
            "prefLabel": "finaliteit doorstroom",
            "narrower": [
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-doorstroom-aso",
                "prefLabel": "aso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-doorstroom-kso",
                "prefLabel": "kso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-doorstroom-tso",
                "prefLabel": "tso"
              }
            ]
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-dubbel",
            "prefLabel": "dubbele finaliteit",
            "narrower": [
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-dubbel-kso",
                "prefLabel": "kso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2-dubbel-tso",
                "prefLabel": "tso"
              }
            ]
          }
        ],
        "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr2",
        "prefLabel": "2e graad"
      },
      {
        "narrower": [
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-arbeidsmarkt",
            "prefLabel": "finaliteit arbeidsmarkt",
            "narrower": [
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-arbeidsmarkt-bso",
                "prefLabel": "bso"
              }
            ]
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-doorstroom",
            "prefLabel": "finaliteit doorstroom",
            "narrower": [
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-doorstroom-aso",
                "prefLabel": "aso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-doorstroom-kso",
                "prefLabel": "kso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-doorstroom-tso",
                "prefLabel": "tso"
              }
            ]
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-dubbel",
            "prefLabel": "dubbele finaliteit",
            "narrower": [
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-dubbel-kso",
                "prefLabel": "kso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-dubbel-tso",
                "prefLabel": "tso"
              }
            ]
          }
        ],
        "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3",
        "prefLabel": "3e graad"
      },
      {
        "narrower": [
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3lj3-arbeidsmarkt",
            "prefLabel": "finaliteit arbeidsmarkt",
            "narrower": [
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3lj3-arbeidsmarkt-bso",
                "prefLabel": "bso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3lj3-arbeidsmarkt-kso",
                "prefLabel": "kso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3lj3-arbeidsmarkt-tso",
                "prefLabel": "tso"
              }
            ]
          },
          {
            "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3lj3-doorstroom",
            "prefLabel": "finaliteit doorstroom",
            "narrower": [
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3lj3-doorstroom-aso",
                "prefLabel": "aso"
              },
              {
                "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3lj3-doorstroom-kso",
                "prefLabel": "kso"
              }
            ]
          }
        ],
        "id": "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3lj3",
        "prefLabel": "3e graad - 3e leerjaar"
      }
    ],
    "prefLabel": "secundair onderwijs",
    "topConceptOf": "http://ilearn.ilabt.imec.be/vocab/ondniv/_scheme"
  }
]

/**
 * Recursive function that does the work
 */
function _findHighestMatching(regex, start, level) {
  let resultConcept = null;
  let resultLevel = Number.MAX_VALUE;
  let arr = [];
  if (Array.isArray(start)) {
    arr = start;
  } else {
    if (regex.test(start.prefLabel)) {
      resultConcept = start;
      resultLevel = level;
    }
    if (start.hasOwnProperty("narrower")) {
      arr = start.narrower;
    }
  }
  for (const c of arr) {
    const [newConcept, newLevel] = _findHighestMatching(regex, c, level + 1);
    if (newConcept && newLevel < resultLevel) {
      resultConcept = newConcept;
      resultLevel = newLevel;
    }
  }
  return [resultConcept, resultLevel];
}

/**
 * Find the highest onderwijsniveau concept in the hierarchy, whose prefLabel matches a regular expression
 * @param regex the regular expression
 * @param from an optional concept to use as a starting point in the hierarchy
 * @returns the concept, or null if none fits
 */
function findHighestOnderwijsNiveauWithMatchingPrefLabel(regex, from) {
  const [resultConcept, level] = _findHighestMatching(regex, from ? from : onderwijsNiveaus, 0);
  return resultConcept;
}

// (function test() {
//   const assert = require('assert').strict;
//
//   // find in all onderwijsniveaus
//   const basis = findHighestOnderwijsNiveauWithMatchingPrefLabel(/^basis/i);
//   assert.equal(basis.id, "http://ilearn.ilabt.imec.be/vocab/ondniv/basis");
//
//   // find starting from given concept
//   const lj6 = findHighestOnderwijsNiveauWithMatchingPrefLabel(/6.*leerjaar/i, basis);
//   assert.equal(lj6.id, "http://ilearn.ilabt.imec.be/vocab/ondniv/basis-lager-lj6");
//
//   // find in all onderwijsniveaus
//   const sec = findHighestOnderwijsNiveauWithMatchingPrefLabel(/^secundair/i);
//   assert.equal(sec.id, "http://ilearn.ilabt.imec.be/vocab/ondniv/sec");
//
//   // find starting from given concept
//   const gr3 = findHighestOnderwijsNiveauWithMatchingPrefLabel(/3.*graad/i, sec);
//   assert.equal(gr3.id, "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3");
//
//   // find starting from given concept
//   const aso = findHighestOnderwijsNiveauWithMatchingPrefLabel(/aso/i, gr3);
//   assert.equal(aso.id, "http://ilearn.ilabt.imec.be/vocab/ondniv/sec-gr3-doorstroom-aso");
//
//   console.log("All tests finished well");
// })();

module.exports = {
  findHighestOnderwijsNiveauWithMatchingPrefLabel
}

