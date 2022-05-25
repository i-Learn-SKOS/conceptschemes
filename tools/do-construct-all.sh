#!/bin/bash
# Do everything to obtain all files to be deployed

set -e
set -x

echo "=== Mapping"
./map.sh ondniv
./map.sh icons
./map.sh onddoel

echo "=== Post-fixing ../schemes/onddoel.ttl"
node modify-onddoel.js
node list-onddoel-descriptions.js > ../schemes/onddoel-descriptions.txt

echo "=== Creating ../schemes/tref2.ttl"
./lager-onderwijs-keywords.sh

echo "=== Skosifying"
mkdir -p temp
# Uncomment to make temp files as needed to look at new developments...
#skosify -c skosify-ours.cfg -o temp/elem-inferred.ttl ../schemes/elem.ttl
#skosify -c skosify-ours.cfg -o temp/curr1-inferred.ttl ../schemes/curr1.ttl
#skosify -c skosify-ours.cfg -o temp/vak1-inferred.ttl ../schemes/vak1.ttl
#skosify -c skosify-ours.cfg -o temp/tref1-inferred.ttl ../schemes/tref1.ttl
#skosify -c skosify-ours.cfg -o temp/curr2-inferred.ttl ../schemes/curr2.ttl
#skosify -c skosify-ours.cfg -o temp/tref2-inferred.ttl ../schemes/tref2.ttl
#skosify -c skosify-ours.cfg -o temp/ondniv-inferred.ttl ../schemes/ondniv.ttl
#skosify -c skosify-ours.cfg -o temp/onddoel-inferred.ttl ../schemes/onddoel.ttl

# This is the real thing
skosify -c skosify-ours.cfg -o ../schemes/combined-inferred.ttl ../schemes/elem.ttl ../schemes/curr1.ttl ../schemes/vak1.ttl ../schemes/tref1.ttl ../schemes/curr2.ttl ../schemes/tref2.ttl ../schemes/ondniv.ttl ../schemes/icons.ttl ../schemes/onddoel.ttl
