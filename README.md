# conceptschemes

## Introduction

This project holds the [SKOS](https://www.w3.org/2009/08/skos-reference/skos.html) ConceptSchemes as used in the i-Learn project MyWay application.

These semantic data are delivered as RDF files, created by any kind of tool, including a text editor, [VocBench](http://vocbench.uniroma2.it/), [RML](https://rml.io/) etc...

Some RDF files are handcrafted with a text editor. These files contain comments and are structured for easy maintenance.

Other RDF files are created by mapping some datasource.
Mapping is supported in this repository's **tools** directory.

In order to be used by other tools, such as [Skosmos](http://www.skosmos.org/), some RDF files might
need some cleanup or additional triplets. One example is to add `skos:narrower` predicates
in the opposite direction of `skos:broader` predicates between two concepts.
The improved files are available next to their input files, e.g. with a name suffix `-inferred`.**
All improvements are supported in this repository's **tools** directory.

## Directory overview

**schemes**
Contains the output of this project: all RDF files (handcrafted, tool-generated, tool-improved)

**input**
Contains all input data used to handcraft RDF files and an [appropriate readme](input/README.md) that describes these files and their history.

**tools**
Contains all tools used in this project. Full documentation in [its readme](tools/README.md).

## How to reconstruct the output of this project

To reconstruct the output, follow the sequence given below.

For details on preparing the necessary environment and executing the scripts in the `tools` directory, consult [its readme](tools/README.md).

**Sequence:**

- if changes are needed to one of the following turtle files in directory `schemes`, edit them directly, based on the corresponding input:
  
| turtle file                    | input file                                      |
|--------------------------------|-------------------------------------------------|
| `elem.ttl`                     | -                                               | 
| `curr1.ttl`                    | `input/secundair-onderwijs.xlsx`                |
 | `bs-to-vak.ttl`                | `conversion/local-vak1-to-common-vak/README.md` | 
| `tref1.ttl`                    | `input/secundair-onderwijs.xlsx`                |
| `curr2.ttl`                    | `input/lager-onderwijs.xlsx`                    |
| `onderwijsstructuur-extra.ttl` | -                                               |
| `in-use-by-myway.ttl`          | -                                               |

- if changes are needed to `schemes/tref2.ttl`, edit `input/lager-onderwijs.xlsx` accordingly
  - conversion to turtle will happen automatically in a later step
- note that no changes are allowed to shopped files; see [here](schemes/README.md) for file origin.
- if one of above changes requires an update of `schemes/onddoel.ttl` (onderwijsdoelen), proceed as follows:
  - execute `do-construct-all.sh` in the `tools` directory
  - deploy the temporary version of `combined-inferred.ttl` to the default graph - see "Deploy turtle files" below
- if changes are needed to `schemes/onddoel.ttl` (either intentionally or indirectly because of changes above):  
  - follow the instructions described in directory `input/onderwijsdoelen` to create/update all source and helper files
    and generate the derived files. Note: this uses the temporary deployment done above.
  - conversion to turtle will happen automatically in a later step
- if changes are needed to `schemes/icons.ttl`, change `input/iconen/iconen.xlsx` and update its UTF-8 encoded CSV export `input/iconen/iconen.csv`.
  Note that one change was done already, starting from `input/iconen/iconen-before-common-ondstruct-uris.xlsx` and documented in [the tools readme](tools/README.md). 
- if changes are needed to `schemes/ostr-additions.ttl`, change `input/onderwijsstructuur/ostr-additions.xlsx` and update its UTF-8 encoded CSV export `input/onderwijsstructuur/ostr-additions.csv`.
- execute `do-construct-all.sh` in the `tools` directory
- deploy the final version of `combined-inferred.ttl` to the default graph - see "Deploy turtle files" below
- optionally (if SKOSMOS is in use): deploy other files to the appropriate graphs - see "Deploy turtle files" below

## What to deploy from this repo

### 1. Deploy turtle files

Follow the server-specific instructions ("Modifying the dataset" in the server documentation) to deploy the following file(s)
on the SPARQL server (Apache Jena Fuseki) and on Skosmos.

| Graph                                               | Uploaded from file                                    | Required? |
|-----------------------------------------------------|-------------------------------------------------------|-----------|
| (default)                                           | schemes/combined-inferred.ttl                         | yes       |
| http://ilearn.ilabt.imec.be/vocab/elem/             | tools/temp/elem-inferred.ttl                          | no        |
| http://ilearn.ilabt.imec.be/vocab/curr1/            | tools/temp/curr1-inferred.ttl                         | no        |
| http://ilearn.ilabt.imec.be/vocab/tref1/            | tools/temp/tref1-inferred.ttl                         | no        |
| http://ilearn.ilabt.imec.be/vocab/curr2/            | tools/temp/curr2-inferred.ttl                         | no        |
| http://ilearn.ilabt.imec.be/vocab/tref2/            | tools/temp/tref2-inferred.ttl                         | no        |
| http://ilearn.ilabt.imec.be/vocab/onddoel/          | tools/temp/onddoel-inferred.ttl                       | no        |

### 2. Deploy static files

This is supported with a script [here](tools/README.md). See that script for an overview of deployed files.
