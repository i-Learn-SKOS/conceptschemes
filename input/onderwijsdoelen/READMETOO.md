# Onderwijsdoelen: how to reconstruct

Description of the steps to execute in order to create derived files for onderwijsdoelen, starting from the retrieved input files `onderwijsdoelen-*.xlsx`.

The derived files are used later as the input for the RML mapper, who'll create a concept scheme from it.

# Step 1: Create helper files
## Goal
Make Excel files `lookup-onderwijsdoelen-*.xlsx` containing lookup tables, suitable for processing in the next step.

## How
### Overview

| input | tool | output |
| ----- | ---- | ------ |
| `onderwijsdoelen-*.xlsx` | `../../tools/prepare-onderwijsdoelen-lookup-column-all.sh` | `lookup-column-*.txt` |
| `http://ilearn.privatedmz:3030/dataset.html` | SPARQL query (see below) | `lookup-more-columns-*.csv` |
| `lookup-column-*.txt` <br> `lookup-more-columns-*.csv` | handcrafted (see below) | `lookup-onderwijsdoelen-*.xlsx` |

### lookup-column-*.txt
To generate these files, execute script `../../tools/prepare-onderwijsdoelen-lookup-column-all.sh` documented [here](../../tools/README.md).

### lookup-more-columns-*.csv
To generate these files, reading back (as CSV) info from SPARQL endpoint `http://ilearn.privatedmz:3030/dataset.html`,
using the following SPARQL query, where the parameters are replaced as given in the table underneath.

***It is therefore important that the dataset (without the onderwijsdoelen...) is already deployed.***

```
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT ?concept ?prefLabelNl ?definitionNl
WHERE {
  ${coll1} skos:member ?concept .
  ${coll2} skos:member ?concept .
  ?concept a skos:Concept .
  ?concept skos:prefLabel ?prefLabelNl .
  FILTER LANGMATCHES(LANG(?prefLabelNl), "nl")
  OPTIONAL {
    ?concept skos:definition ?definitionNl .
    FILTER LANGMATCHES(LANG(?definitionNl), "nl")
  }
}
ORDER BY ?prefLabelNl
```

| file | ${coll1} | ${coll2} |
| ---- | -------- | -------- |
| lookup-more-columns-L-LG.csv | `<http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs>` | `<http://ilearn.ilabt.imec.be/vocab/elem/leergebieden>` |
| lookup-more-columns-L-SD.csv | `<http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs>` | `<http://ilearn.ilabt.imec.be/vocab/elem/subdomeinen>` |
| lookup-more-columns-L-TH.csv | `<http://ilearn.ilabt.imec.be/vocab/elem/lager-onderwijs>` | `<http://ilearn.ilabt.imec.be/vocab/elem/themas>` |
| lookup-more-columns-S-SL.csv | `<http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs>` | `<http://ilearn.ilabt.imec.be/vocab/elem/sleutelcompetenties>` |
| lookup-more-columns-S-WD.csv | `<http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs>` | `<http://ilearn.ilabt.imec.be/vocab/elem/wetenschapsdomeinen>` |
| lookup-more-columns-S-BS.csv | `<http://ilearn.ilabt.imec.be/vocab/elem/secundair-onderwijs>` | `<http://ilearn.ilabt.imec.be/vocab/elem/bouwstenen>` |

### lookup-onderwijsdoelen-*.xlsx
Handcraft these files, using the intermediate helper files created above.

For every X in `L`, `S`:
- Create a new blank workbook `lookup-onderwijsdoelen-X.xlsx`
- For every Y in the filenames `lookup-column-X-Y[-Z].txt`:
    - Create a worksheet named `X-Y[-Z]` in the workbook; further called the active worksheet, (e.g. `L-LG`, `L-SD-frans`).
    - In row 1, add following column names: **text-not-related**, **text-related**.
    - Import file `lookup-column-X-Y.txt` in `Sheet1` (Delimiter: TAB, File origin: 65001 Unicode (UTF-8)).
    - Copy/paste (VALUES ONLY!) the imported column to the cell under **text-not-related** in the active worksheet.
    - Clear `Sheet1`.
    - Import *corresponding* file `lookup-more-columns-X-Y.csv` in `Sheet1` (Delimiter: Other = `"` (double quote), File origin: 65001 Unicode (UTF-8)).
    - Remove all columns except for these named **concept**, **prefLabelNl** and **definitionNl**.
    - Copy/paste (VALUES ONLY!) the imported range to the cell to the right of **text-related**.
    - To connect a cell in column **text-not-related** to a concept in the column **concept**, move that cell to the row of the concept, in the column **text-related**.
        - To connect more than one such cell to the same concept, create additional columns **text-related2**, **text-related3** etc... as needed.
        - Specific for `L`:
            - For `L-SD-frans`, consider only values `Frans|...`
            - Fpr `L-SD-generic`, do no consider values `Frans|...`
    - Clear `Sheet1`.

# Step 2: Compile input files and helper files into final derived files
## Goal
Combine the data of the input files `onderwijsdoelen-*.xlsx` and of the helper files created above
into derived files `onderwijsdoelen-*-prepared.csv` suitable for the RML mapper.

## How
Execute the script `../../tools/prepare-onderwijsdoelen-all.sh` documented [here](../../tools/README.md).

## Details
See Appendix below.

# Appendix: details about prepare-onderwijsdoelen-all.sh

For information only: what this script does.

## Cleanup
- delete columns that do not have a value in row 1 (i.e. no header)
- clean fields (trim texts, replace unwanted characters)

## Creation of an ID for each onderwijsdoel
Add a column `Id` to all `onderwijsdoelen-*-prepared.csv` files, to be used as an ID (--> URI) later.

Principles:
- used fields per file:

  | file                                                   | Niveau | Onderwijsstructuur | Soort | Graad | Stroom | Finaliteit | Onderwijsvorm | Indeling | Sleutelcompetentie | Wetenschapsdomein | Nummer / Code |
  | ------------------------------------------------------ | ------ | ------------------ | ----- | ----- | ------ | ---------- | ------------- | -------- | ------------------ | ----------------- | ------------- |
  | onderwijsdoelen-lager.xlsx                             | *      | *                  | *     |       |        |            |               | *        |                    |                   | *             |
  | onderwijsdoelen-secundair-graad1-na-modernisering.xlsx | *      |                    | *     | *     | *      |            |               |          | *                  |                   | *             |
  | onderwijsdoelen-secundair-graad2-na-modernisering.xlsx | *      |                    | *     | *     |        | *          | *             |          | *                  |                   | *             |
  | onderwijsdoelen-secundair-graad3-na-modernisering.xlsx | *      |                    | *     | *     |        | *          | *             |          | *                  | *                 | *             |

- fields, generalized and put in a preferred order ([ ]: if column available and field not empty):

  `Niveau` `[Onderwijsstructuur]` `Soort` `[Graad]` `[Stroom]` `[Finaliteit]` `[Onderwijsvorm]` `[Indeling]` `[Sleutelcompetentie]` `[Wetenschapsdomein]` `Nummer / Code`

- in construction of Id, don't write fields literally, but use some ad hoc code lists (inspired on how we created URIs elsewhere).
  (See `transformationsForId` in `../../tools/prepare-onderwijsdoelen.js`)

## Linking onderwijsdoelen to existing onderwijsniveaus
Add a column `Onderwijsniveau_id` to all `onderwijsdoelen-*-prepared.csv` files, containing the URI of an existing onderwijsniveau concepts, so that these can be linked to the corresponding onderwijsdoel.

Principles:
- used fields per file, order and used code list:
  similar to creation of ID above, however restricted to `Niveau` `[Onderwijsstructuur]` `Soort` `[Graad]` `[Stroom]` `[Finaliteit]` `[Onderwijsvorm]`

## Linking onderwijsdoelen to existing curriculum concepts
Add several columns `Verwant ...` to all `onderwijsdoelen-*-prepared.csv` files, containing URIs of existing curriculum concepts, so that these can be linked to the corresponding onderwijsdoel.

Principles:
- The URI of a related
  `leergebied`, `subdomein`, `thema`, `sleutelcompetentie`, `bouwsteen` and `wetenschapsdomein`
  is added in new output columns with corresponding names `Verwant leergebied`, `Verwant subdomein`, etc.

- This URI is looked up from the helper files `lookup-onderwijsdoelen-L.xlsx` and `lookup-onderwijsdoelen-S.xlsx` described above.
  Input for the lookup is matched against columns **text-related** (and additional columns **text-related...** if any).
  Output of the lookup is taken from the column **concept**.

- Inputs for the lookup are the `|`-joined values of the relevant columns in the `onderwijsdoelen-*.xlsx` files.
  Outputs of the lookup are written to the relevant output columns, based on  different conditions:
    - For lager (curr2)

      | Condition | Relevant input column(s) | Relevant output column |
      | ----------| ------------------------ | ---------------------- |
      | all | Indeling | Verwant leergebied |
      | Indeling == "Frans" | Indeling, Titel 2 | Verwant subdomein |
      | Indeling != "Frans" | Indeling, Titel 1 | Verwant subdomein |
      | Indeling != "Frans" | Indeling, Titel 2 | Verwant thema |

    - For secundair (curr1)

      | Condition | Relevant input column(s) | Relevant output column |
      | ----------| ------------------------ | ---------------------- |
      | Sleutelcompetentie not empty | Sleutelcompetentie | Verwante sleutelcompetentie |
      | Sleutelcompetentie not empty | Sleutelcompetentie, Onderdeel | Verwante bouwsteen |
      | Wetenschapsdomein not empty | Wetenschapsdomein | Verwant wetenschapsdomein |
      | Wetenschapsdomein not empty | Wetenschapsdomein, Onderdeel | (none!) |

