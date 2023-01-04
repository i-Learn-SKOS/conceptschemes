# Tools

Collection of all tools to be executed in the scope of this project.

> Executive summary:
> - execute scripts `*.sh` from a bash shell, in the current directory.
> - top tools: see **3 - Top tools** below.

## 1 - Installation

### 1.1 - Dependencies
Install the following dependencies on your system:
* [python3](https://www.python.org) (3.6 ... 3.8 - works for Ubuntu 18.04 LTS and Ubuntu 20.04 LTS distributions)
* [node](https://nodejs.org/) (v16.18.1 or better: we're using string.replaceAll)
* [yarn (1, classic)](https://classic.yarnpkg.com) (1.22.5 or better)
* Java (I'm using OpenJDK version 14)

### 1.2 - Python virtual environment
Install an isolated virtual environment (named `virtualenv`) under the current directory. This one also installs all required modules.
```shell
python3 -m venv virtualenv
source virtualenv/bin/activate
python -V
python -m pip install -r requirements.txt 
deactivate
```

Note: initial requirements were set in `requirements-initial.txt`.
Last known good requirements are saved in `requirements.txt`, created in an activated virtual environment with `python -m pip freeze > requirements.txt`.


### 1.3 - Node modules
```shell
yarn install
```

### 1.4 - YARRRML
```shell
./download-yarrrml.sh
```

### 1.5 - RML Mapper
Download `rmlmapper.jar` from the releases of https://github.com/RMLio/rmlmapper-java to this directory.

The version to download is defined in `RML_MAPPER` in `map.sh`.

## 2 - Activation
Only needed for Python-based tools:
```shell
source virtualenv/bin/activate
```

## 3 - Top tools

### 3.1 - (Re)construct all files delivered by this project
Note: before executing, make sure all input files and derived files are up to date.

Execute:
```shell
./do-construct-all.sh
```

### 3.2 - Deploy static files delivered by this project
For this to work, clone this repo on the destination server.

Execution requires sudo rights on the server.

Execute:
```shell
./do-deploy-static.sh
```
It does not require any installation.

## 4 - Underlying tools

### 4.1 - Deriving RDF from provided input datasources using RML
For each mapping `x`:
1. Make sure the input is available in supported format. It is common to export .xlsx files into CSV and put the resulting .csv next to the .xlsx.
   The file should be UTF8 encoded. On some platforms this requires an extra step (Notepad++ can do this for you, if your Excel can't).
2. Create/update a [YARRRML](https://rml.io/yarrrml/) rules file `./mappings/x.yarrrml.yml`.
3. Convert this file with the yarrrml-parser into a RML mapping file `./mappings/x.rml.ttl` (this one is git-ignored).
4. Run the RMLMapper with this file and save the result as `./mappings/x_generated.ttl` (this one is git-ignored).
5. Verify RDF-correctness of this file.
6. [Canonicalize](https://json-ld.github.io/rdf-dataset-canonicalization/spec/) this file into the final output file `../schemes/x.ttl`.

Steps 3, 4, 5, 6 are supported by the `map.sh` script in this directory.

(Steps 2, 3, 4 can also be done using [Matey](https://rml.io/yarrrml/matey/); don't forget to save the resulting files and complete steps 5 and 6 in that case.)

To do one mapping `x` with `map.sh`:
```shell
./map.sh x
```

**Note: this script is called for all applicable mappings from `do-construct-all.sh`.**

### 4.2 - Deriving RDF from lager onderwijs input datasource using dedicated tool
This tool is currently only used to generate `../schemes/tref2.ttl`. Other lager onderwijs RDF is handcrafted from the same datasource.

Help, test:
```shell
node lager-onderwijs-keywords.js -h
node lager-onderwijs-keywords.js -i ./test/lager-onderwijs-test.xlsx -o ./temp/lager-onderwijs-test.ttl
```

For the purpose it was built, execute:
```shell
./lager-onderwijs-keywords.sh
```

**Note: this script is called from `do-construct-all.sh`.**

### 4.3 - Skosify
[Skosify](https://skosify.readthedocs.io/) is installed as a python3 module (see `requirements.txt`).
We also save two configurations:
- `skosify-default.cfg`: for illustration; how skosify behaves, if no contradicting options are given at its commandline.
- `skosify-ours.cfg`: the options we use in this project

Prototype of the command to execute:
```shell
skosify -c skosify-ours.cfg -o ../schemes/<output-file> ../schemes/<input-file>
```

**Note: skosify is executed for all applicable files from `do-construct-all.sh`.**

### 4.4 - Modify onderwijsdoelen
Simple tool to modify onderwijsdoelen.
Modifies local file `../schemes/onddoel.ttl`.

Allows ad hoc corrections to onderwijsdoelen, without touching the input Excel files.

Run:
```shell
node modify-onddoel.js
```

**Note: this script is called from `do-construct-all.sh`.**

### 4.5 - List onderwijsdoelen URIs and definitions
Simple tool listing onderwijsdoelen URIs and definitions line by line. Implemented as a SPARQL query sent to Comunica. Read local file `../schemes/onddoel.ttl`.

Run:
```shell
node list-onddoel-descriptions.js
```

**Note: this script is called from `do-construct-all.sh`.**

### 4.6 Convert a string using a lookup table in another .xlsx file

A node module (`utils-excel-lookup.js`) provides this functionality.

**Note: this module is used when `do-construct-all.sh` is executed (through `prepare-onderwijsdoelen.js`).**

## 5 - Miscellaneous tools

### 5.1 - Making overviews using GraphQL-LD queries
This tool consults the deployed output through the API project.

Help:
```shell
node overviews-using-grapql-ld.js -h
```

To make all applicable overviews in a (git-ignored) `../overviews` folder, execute:
```shell
./get-overviews.sh
```

**Note: > It is important to execute `get-overviews.sh` *after* having deployed all RDF files.**

### 5.2 - Prepare Onderwijsdoelen lookup columns
Extract from downloaded files `../input/onderwijsdoelen/*.xlsx` unique texts to create the first column of a lookup table
to be used by the next tool (`prepare-onderwijsdoelen.js`).

Help, test:
```shell
node prepare-onderwijsdoelen-lookup-column.js -h
```

For the purpose it was built, execute:
```shell
./prepare-onderwijsdoelen-lookup-column-all.sh
```

### 5.3 - Prepare Onderwijsdoelen input
Convert downloaded files `../input/onderwijsdoelen/*.xlsx` into `../input/onderwijsdoelen/*-prepared.xlsx` for further usage.

Help, test:
```shell
node prepare-onderwijsdoelen.js -h
node prepare-onderwijsdoelen.js -i ./test/onderwijsdoelen-test.xlsx -o ./temp/onderwijsdoelen-test-prepared.xlsx -l debug
```

For the purpose it was built, execute:
```shell
./prepare-onderwijsdoelen-all.sh
```

### 5.4 - Make conversion workbooks

From the old onderwijsniveaus and the new common onderwijsstructuur, make helper .xlsx files to facilitate the making of a was-is list.

Output is in the directory `../conversion/local-ondniv-to-common-onderwijsstructuur`.

Use the output to handcraft `../conversion/local-ondniv-to-common-onderwijsstructuur/was-is.xlsx`

Execute:
```shell
node make-conversion-workbooks.js
```

### 5.5 - Convert a .xlsx file using a lookup table in another .xlsx file

This tool's primary goal is to convert old local ondniv uris to new common onderwijsstructuur uris, using the conversion workbook `../conversion/local-ondniv-to-common-onderwijsstructuur/was-is.xlsx`. But the tool is generic.

This tool makes use of `utils-excel-lookup.js`, described above under the "underlying tools".

Help, test:
```shell
node replace-cells.js -h
node replace-cells.js -i ./test/replaceCellsFileIn.xlsx -s "Sheet1" -o ./temp/replaceCellsFileOut.csv -L ./test/replaceCellsLookupFile.xlsx -S "Sheet1" -I "from" -O "to" -l debug
```

To make new `input/iconen/iconen.xlsx` and `input/iconen/iconen.xlsx`(a one-time operation after switching to the new common onderwijsstructuur uris), execute:
```shell
node replace-cells.js -i ../input/iconen/iconen-before-common-ondstruct-uris.xlsx -s "Sheet1" -o ../input/iconen/iconen.xlsx -L ../conversion/local-ondniv-to-common-onderwijsstructuur/was-is.xlsx -S "Concepts" -I "old uri" -O "new uri" -l debug
node replace-cells.js -i ../input/iconen/iconen-before-common-ondstruct-uris.xlsx -s "Sheet1" -o ../input/iconen/iconen.csv  -L ../conversion/local-ondniv-to-common-onderwijsstructuur/was-is.xlsx -S "Concepts" -I "old uri" -O "new uri" -l debug
```
