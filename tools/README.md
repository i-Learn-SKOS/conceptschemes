# Tools

Collection of all tools to be executed in the scope of this project.

> Executive summary:
> - execute scripts `*.sh` from a bash shell, in the current directory.
> - top tools: see **3 - Top tools** below.

## 1 - Installation

### 1.1 - Dependencies
Install the following dependencies on your system:
* [python3](https://www.python.org) (3.6.9 or better - keeping this for availability from Ubuntu 18.04 LTS distribution)
* [node](https://nodejs.org/) (v14.15.0 or better)
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

Modify the filename to include the version in the filename, e.g. `rmlmapper-4.12.0.jar`; adapt `map.sh` accordingly.

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

### 5 - Miscellaneous tools

## 5.1 - Making overviews using GraphQL-LD queries
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

## 5.2 - Prepare Onderwijsniveaus input
Convert input files `../input/onderwijsniveaus/onderwijsniveaus.xlsx` into `../input/onderwijsniveaus/onderwijsniveaus-prepared.xlsx` for further usage.

Help, test:
```shell
node prepare-onderwijsniveaus.js -h
node prepare-onderwijsniveaus.js -i ./test/onderwijsniveaus-test.xlsx -o ./temp/onderwijsniveaus-test-prepared.xlsx -l debug
```

For the purpose it was built, execute:
```shell
./prepare-onderwijsniveaus.sh
```

## 5.3 - Prepare Onderwijsdoelen lookup columns
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


## 5.4 - Prepare Onderwijsdoelen input
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
