#!/bin/bash
# Map data described in a x.yarrrrml.ttl into one x.ttl RDF file
# Arguments
#   $1: basename x of the input map file x.yarrrrml.ttl
#   $2: directory of the input map file (default: ./mappings)
#   $3: directory of the output RDF file x.ttl (default: ../schemes)
#   $4: directory of the temporary files created in this script (default: ./temp)

# Stop immediately after non-zero exit code
set -e

YARRRML_PARSER="./yarrrml-parser/bin/parser.js"
# need to stick to version 4.12.0 because it does not have this bug https://github.com/RMLio/rmlmapper-java/issues/165 not solved in any later version at present
# hence there is no lookup function available
RML_MAPPER="rmlmapper-4.12.0.jar"
if [ ! -f $YARRRML_PARSER ];
then
  echo "yarrrml parser not found at '$YARRRML_PARSER'"
  exit 1
elif [ ! -f $RML_MAPPER ]
then
  echo "rml mapper not found at '$RML_MAPPER'"
  exit 1
fi

if [ "$#" -lt 1 ];
then
  echo "Please provide at least the basename x of the input map file x.yarrrrml.ttl, e.g. ondniv"
  exit 1
fi

BASENAME=$1
DIR_IN=${2:-./mappings}
DIR_OUT=${3:-../schemes}
DIR_TEMP=${4:-./temp}
FILE_IN="${DIR_IN}/${BASENAME}.yarrrml.yml"
FILE_RML="${DIR_TEMP}/${BASENAME}.rml.ttl"
FILE_GENERATED="${DIR_TEMP}/${BASENAME}.generated.ttl"
FILE_OUT="${DIR_OUT}/${BASENAME}.ttl"

if [ ! -f ${FILE_IN} ];
then
  echo "File ${FILE_IN}" not found!
  exit 1
fi

if [ ! -d ${DIR_OUT} ];
then
  echo "Directory ${DIR_OUT}" not found!
  exit 1
fi

if [ ! -d ${DIR_TEMP} ];
then
  echo "Directory ${DIR_TEMP}" not found, creating one!
  mkdir ${DIR_TEMP}
fi

rm -f ${FILE_RML}
rm -f ${FILE_GENERATED}
rm -f ${FILE_OUT}

echo "===== 1. yarrrml-parser ${FILE_IN} --> ${FILE_RML}"
node $YARRRML_PARSER -i ${FILE_IN} -o ${FILE_RML}

echo "===== 2. rmlmapper ${FILE_RML} --> ${FILE_GENERATED}"
# Add -v[v[v]] option for debugging, in case of trouble...
java -jar $RML_MAPPER -m ${FILE_RML} -o ${FILE_GENERATED} -s turtle

echo -n "===== 3. verify ${FILE_GENERATED}: "
python3 verify-rdf.py -i ${FILE_GENERATED}

echo "===== 4. canonicalize ${FILE_GENERATED} --> ${FILE_OUT}"
node canonicalize.js -i ${FILE_GENERATED} -o ${FILE_OUT}
