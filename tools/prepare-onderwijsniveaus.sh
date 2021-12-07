#!/bin/bash

set -e

node prepare-onderwijsniveaus.js -i ../input/onderwijsniveaus/onderwijsniveaus.xlsx -s onderwijsniveaus -o ../input/onderwijsniveaus/onderwijsniveaus-prepared.csv -c -l info

