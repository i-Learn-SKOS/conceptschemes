#!/bin/bash

set -e

FILE_IN=../input/lager-onderwijs.xlsx
FILE_GENERATED=temp/tref2.generated.ttl
FILE_OUT=../schemes/tref2.ttl

node lager-onderwijs-keywords.js -i ${FILE_IN} -o ${FILE_GENERATED}
python3 verify-rdf.py -i ${FILE_GENERATED}
node canonicalize.js -i ${FILE_GENERATED} -o ${FILE_OUT}

