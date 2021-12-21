#!/bin/bash
# Do everything to obtain all files to be deployed

set -e
set -x

echo "=== Mapping"
./map.sh ondniv
./map.sh icons
./map.sh onddoel

echo "=== Creating ../schemes/tref2.ttl"
./lager-onderwijs-keywords.sh

echo "=== Skosifying"
skosify -c skosify-ours.cfg -o ../schemes/elem-inferred.ttl ../schemes/elem.ttl
skosify -c skosify-ours.cfg -o ../schemes/curr1-inferred.ttl ../schemes/curr1.ttl
skosify -c skosify-ours.cfg -o ../schemes/vak1-inferred.ttl ../schemes/vak1.ttl
skosify -c skosify-ours.cfg -o ../schemes/tref1-inferred.ttl ../schemes/tref1.ttl
skosify -c skosify-ours.cfg -o ../schemes/curr2-inferred.ttl ../schemes/curr2.ttl
skosify -c skosify-ours.cfg -o ../schemes/tref2-inferred.ttl ../schemes/tref2.ttl
skosify -c skosify-ours.cfg -o ../schemes/ondniv-inferred.ttl ../schemes/ondniv.ttl
skosify -c skosify-ours.cfg -o ../schemes/onddoel-inferred.ttl ../schemes/onddoel.ttl
skosify -c skosify-ours.cfg -o ../schemes/combined-inferred.ttl ../schemes/elem.ttl ../schemes/curr1.ttl ../schemes/vak1.ttl ../schemes/tref1.ttl ../schemes/curr2.ttl ../schemes/tref2.ttl ../schemes/ondniv.ttl ../schemes/icons.ttl ../schemes/onddoel.ttl
