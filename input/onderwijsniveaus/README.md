# Onderwijsniveaus

This folder contains the input data source **onderwijsniveaus.xlsx**
and the file **onderwijsniveaus-prepared.csv** derived from it.

To reconstruct, execute the script `../../tools/prepare-onderwijsniveaus.sh` documented [here](../../tools/README.md).

Input for this data source was (at time of writing, July 6th 2021):
- For the general idea and provisional structure: https://www.klascement.net/lesmateriaal/
- For final structure and naming: https://onderwijs-vlaanderen-portaalov.apigee.io/docs/onderwijsdoelen-v1/1/types/onderwijsstructuur.object
- For the structure under "3e graad - 3e leerjaar" https://www.onderwijskiezer.be/v2/secundair/sec_3graad_bso_7j.php and https://www.onderwijskiezer.be/v2/secundair/sec_3graad_sense.php

The derived file is used later as the input for the RML mapper, who'll create a concept scheme from it.

## Ontologies

We created two very small ontologies to link the right concepts together

### http://semweb.mmlab.be/ns/ilearn#

> URI might be temporary

- prefix: `ilearn`

#### ilearn:Onderwijsniveau

> Not used currently; if reintroducing, consider adding ilearn:Onderwijssubniveau as well

Class to denote a specific (Flemish) educational context.
A formal external definition isn't yet found, but many official websites use the term 'onderwijsniveau' to make the distiction between 'lager/basisonderwijs', 'secundair onderwijs', etc.
See, e.g., https://onderwijs.vlaanderen.be/nl/directies-en-administraties.
An example is found at https://onderwijs-vlaanderen-portaalov.apigee.io/docs/onderwijsdoelen-v1/1/types/onderwijsniveau

#### ilearn:Niveau

> Not used currently

Class to denote a specific (Flemish) educational level, typically within a specific ilearn:OnderwijsNiveau.
A formal external definition isn't yet found. It seems the distinction '1e graad', '2e graad' and '3e graad' is strict within, e.g., https://onderwijsdoelen.be/toelichting.
However, here we chose to also include the years of kindergarten and primary school, to be conform with https://www.klascement.net/metadataschema/educationtype/.
And example is found at https://onderwijs-vlaanderen-portaalov.apigee.io/docs/onderwijsdoelen-v1/1/types/graad

#### ilearn:Finaliteit

> Not used currently

Class to denote a specific (Flemish) educational finality, typically within a specific ilearn:Niveau.
A formal external definition isn't yet found. It seems the distinction 'doorstroomfinaliteit', 'dubbele finaliteit' and 'arbeidsfinaliteit' is strict within, e.g., https://onderwijsdoelen.be/toelichting.
And example is found at https://onderwijs-vlaanderen-portaalov.apigee.io/docs/onderwijsdoelen-v1/1/types/finaliteit.

#### ilearn:Onderwijsvorm

> Not used currently

Class to denote a specific (Flemish) educational form, typically within a specific ilearn:Finaliteit.
A formal external definition isn't yet found. It seems the distinction 'aso', 'bso', 'tso', and 'kso' is strict within, e.g., https://onderwijsdoelen.be/toelichting.
An example is found at https://onderwijs-vlaanderen-portaalov.apigee.io/docs/onderwijsdoelen-v1/1/types/onderwijsvorm.object

#### ilearn:typicalAgeRange

- definition: the typical age range of the people taught at this educational context or educational level.
- domain: ilearn:Onderwijsniveau or ilearn:Niveau
- range: string formatted in the same way as in [schema:typicalAgeRange](https://schema.org/typicalAgeRange) or [IEEE LOM 5.7 TypicalAgeRange](http://edutab.test.iminds.be/specs/pubelo/pubelo.html#LOM5.7)
- note: we could not reuse schema:typicalAgeRange as the schema one has as domain a Learning Resource.

#### ilearn:hasCurriculum

- definition: the curriculum that is thought to this specific educational context or educational level.
- domain: ilearn:Onderwijsniveau or ilearn:Niveau
- range: skos:Collection (in this case, specifically the collections published under http://ilearn.ilabt.imec.be/vocab/elem/_scheme)


### http://semweb.mmlab.be/ns/lom#

> URI might be temporary

- prefix: `lom`

#### lom:educationalContext

Creates the link between an ilearn:Onderwijsniveau and a [IEEE LOM 5.6 educational context](http://edutab.test.iminds.be/specs/pubelo/pubelo.html#LOM5.6) value.
Mapping should be according to the [Pubelo vocabulary on LOM 5.6](http://edutab.test.iminds.be/specs/pubelo/voc.html#vocLOM5.6)

- definition: "The IEEE LOM 5.6 educational context string that is related to this concept"
- domain: skos:Concept
- range: string
