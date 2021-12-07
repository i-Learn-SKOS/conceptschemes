#!/bin/bash

set -e

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx -c Indeling -o ../input/onderwijsdoelen/lookup-column-L-LG.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx -c Indeling "Titel 1" -o ../input/onderwijsdoelen/lookup-column-L-SD-generic.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx -c Indeling "Titel 2" -o ../input/onderwijsdoelen/lookup-column-L-SD-frans.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-lager.xlsx -c Indeling "Titel 2" -o ../input/onderwijsdoelen/lookup-column-L-TH.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad1-na-modernisering.xlsx -c Sleutelcompetentie    -o ../input/onderwijsdoelen/lookup-column-S-SL.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad2-na-modernisering.xlsx -c Sleutelcompetentie -a -o ../input/onderwijsdoelen/lookup-column-S-SL.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad3-na-modernisering.xlsx -c Sleutelcompetentie -a -o ../input/onderwijsdoelen/lookup-column-S-SL.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad1-na-modernisering.xlsx -c Wetenschapsdomein    -o ../input/onderwijsdoelen/lookup-column-S-WD.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad2-na-modernisering.xlsx -c Wetenschapsdomein -a -o ../input/onderwijsdoelen/lookup-column-S-WD.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad3-na-modernisering.xlsx -c Wetenschapsdomein -a -o ../input/onderwijsdoelen/lookup-column-S-WD.txt -l info

node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad1-na-modernisering.xlsx -c Sleutelcompetentie Onderdeel    -o ../input/onderwijsdoelen/lookup-column-S-BS.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad2-na-modernisering.xlsx -c Sleutelcompetentie Onderdeel -a -o ../input/onderwijsdoelen/lookup-column-S-BS.txt -l info
node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad3-na-modernisering.xlsx -c Sleutelcompetentie Onderdeel -a -o ../input/onderwijsdoelen/lookup-column-S-BS.txt -l info

# next three don't make sense now, because we have no narrower concepts of wetenschapsdomeinen
#node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad1-na-modernisering.xlsx -c Wetenschapsdomein Onderdeel    -o ../input/onderwijsdoelen/lookup-column-S-WD-XX.txt -l info
#node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad2-na-modernisering.xlsx -c Wetenschapsdomein Onderdeel -a -o ../input/onderwijsdoelen/lookup-column-S-WD-XX.txt -l info
#node prepare-onderwijsdoelen-lookup-column.js -i ../input/onderwijsdoelen/onderwijsdoelen-secundair-graad3-na-modernisering.xlsx -c Wetenschapsdomein Onderdeel -a -o ../input/onderwijsdoelen/lookup-column-S-WD-XX.txt -l info

