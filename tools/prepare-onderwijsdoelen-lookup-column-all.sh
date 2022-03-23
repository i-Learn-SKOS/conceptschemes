#!/bin/bash

set -e

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx -c Indeling -o ../input/onderwijsdoelen/lookup-column-L-LG.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx -c Indeling "Titel 1" -o ../input/onderwijsdoelen/lookup-column-L-SD-generic.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx -c Indeling "Titel 2" -o ../input/onderwijsdoelen/lookup-column-L-SD-frans.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx -c Indeling "Titel 2" -o ../input/onderwijsdoelen/lookup-column-L-TH.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad1-na-modernisering.xlsx -c Sleutelcompetentie    -o ../input/onderwijsdoelen/lookup-column-S-SL.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad2-na-modernisering.xlsx -c Sleutelcompetentie -a -o ../input/onderwijsdoelen/lookup-column-S-SL.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad3-na-modernisering.xlsx -c Sleutelcompetentie -a -o ../input/onderwijsdoelen/lookup-column-S-SL.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad1-na-modernisering.xlsx -c Sleutelcompetentie Onderdeel    -o ../input/onderwijsdoelen/lookup-column-S-BS.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad2-na-modernisering.xlsx -c Sleutelcompetentie Onderdeel -a -o ../input/onderwijsdoelen/lookup-column-S-BS.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad3-na-modernisering.xlsx -c Sleutelcompetentie Onderdeel -a -o ../input/onderwijsdoelen/lookup-column-S-BS.txt -l info

# ilearnextra
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/ilearnextra/onderwijsdoelen-lager.xlsx -c Indeling -o ../input/onderwijsdoelen/ilearnextra/lookup-column-L-LG.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/ilearnextra/onderwijsdoelen-lager.xlsx -c Indeling "Titel 1" -o ../input/onderwijsdoelen/ilearnextra/lookup-column-L-SD-generic.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/ilearnextra/onderwijsdoelen-lager.xlsx -c Indeling "Titel 2" -o ../input/onderwijsdoelen/ilearnextra/lookup-column-L-SD-frans.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/ilearnextra/onderwijsdoelen-lager.xlsx -c Indeling "Titel 2" -o ../input/onderwijsdoelen/ilearnextra/lookup-column-L-TH.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/ilearnextra/onderwijsdoelen-secundair.xlsx -c Sleutelcompetentie    -o ../input/onderwijsdoelen/ilearnextra/lookup-column-S-SL.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/ilearnextra/onderwijsdoelen-secundair.xlsx -c Sleutelcompetentie Onderdeel    -o ../input/onderwijsdoelen/ilearnextra/lookup-column-S-BS.txt -l info
