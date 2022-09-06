#!/bin/bash
# Gets all overviews into a (git-ignored) overviews folder

mkdir -p overviews

node overviews-using-grapql-ld.js --top-down http://ilearn.ilabt.imec.be/vocab/curr1/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs --restrict-top-to-collection http://ilearn.ilabt.imec.be/vocab/elem/sleutelcompetenties  > overviews/secundair-top-down-sleutelcompetenties.json
node overviews-using-grapql-ld.js --top-down http://ilearn.ilabt.imec.be/vocab/curr1/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs --restrict-top-to-collection http://ilearn.ilabt.imec.be/vocab/elem/bouwstenen           > overviews/secundair-top-down-bouwstenen.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/curr1/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs                                                                                          > overviews/secundair-related-to-secundair.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/vak1/_scheme    --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs                                                                                          > overviews/secundair-related-to-vak1.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/tref1/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs                                                                                          > overviews/secundair-related-to-tref1.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/onddoel/_scheme --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs                                                                                          > overviews/secundair-related-to-onddoel.json

node overviews-using-grapql-ld.js --top-down http://ilearn.ilabt.imec.be/vocab/curr2/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs     --restrict-top-to-collection http://ilearn.ilabt.imec.be/vocab/elem/leergebieden         > overviews/lager-top-down-leergebieden.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/curr2/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs                                                                                              > overviews/lager-related-to-lager.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/tref2/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs                                                                                              > overviews/lager-related-to-tref2.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/onddoel/_scheme --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs                                                                                              > overviews/lager-related-to-onddoel.json

node overviews-using-grapql-ld.js --top-down https://w3id.org/onderwijs-vlaanderen/id/structuur                                                                                                                                                                             > overviews/ondstruct-top-down.json

node overviews-using-grapql-ld.js --top-down http://ilearn.ilabt.imec.be/vocab/onddoel/_scheme                                                                                                                                                                              > overviews/onddoel-top-down.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/curr1/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/onddoel                                                                                                      > overviews/onddoel-related-to-secundair.json
node overviews-using-grapql-ld.js --related  http://ilearn.ilabt.imec.be/vocab/curr2/_scheme   --restrict-to-collection http://ilearn.ilabt.imec.be/vocab/elem/onddoel                                                                                                      > overviews/onddoel-related-to-lager.json
