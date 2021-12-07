#!/bin/bash

set -e

node prepare-onderwijsdoelen.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx                             -u ../input/onderwijsdoelen/lookup-onderwijsdoelen-L.xlsx -o ../input/onderwijsdoelen/onderwijsdoelen-lager-prepared.csv                             -c -l info
node prepare-onderwijsdoelen.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad1-na-modernisering.xlsx -u ../input/onderwijsdoelen/lookup-onderwijsdoelen-S.xlsx -o ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad1-na-modernisering-prepared.csv -c -l info
node prepare-onderwijsdoelen.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad2-na-modernisering.xlsx -u ../input/onderwijsdoelen/lookup-onderwijsdoelen-S.xlsx -o ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad2-na-modernisering-prepared.csv -c -l info
node prepare-onderwijsdoelen.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad3-na-modernisering.xlsx -u ../input/onderwijsdoelen/lookup-onderwijsdoelen-S.xlsx -o ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad3-na-modernisering-prepared.csv -c -l info

