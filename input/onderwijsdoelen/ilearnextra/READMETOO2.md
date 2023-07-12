# i-Learn specific extra input files

This directory is an addition to its parent directory.

Extra's covered here are explained below.

## Additional onderwijsdoelen "geen eindterm"

In `onderwijsdoelen-lager.xlsx`, a dummy onderwijsdoel `geen eindterm` was created for each (`leergebied`, `subdomein`) combination that exists in i-Learn context, but not in the generic AHOVOKS context.
This dummy onderwijsdoel is linked to the `onderwijsstructuur` concept `https://w3id.org/onderwijs-vlaanderen/id/structuur/lager-onderwijs`.

In `onderwijsdoelen-secundair.xlsx`, a dummy onderwijsdoel `geen eindterm` was created for each (`sleutelcompetentie`, `bouwsteen`) combination that exists in i-Learn context, but not in the generic AHOVOKS context.
For some `MyWay` application implementation reason, this dummy onderwijsdoel was originally not linked to the `onderwijsstructuur`.

Later (1), on request of Steven Deweerdt (Steven.DeWeerdt.ext@imec.be), it was linked to the `onderwijsstructuur` concept(s)
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-onderwijs`

Later (2), on request of Steven Deweerdt (Steven.DeWeerdt.ext@imec.be), it was linked to the `onderwijsstructuur` concepts
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad-a-stroom`
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom`

Later (3), on request of Steven Deweerdt (Steven.DeWeerdt.ext@imec.be), it was linked to the `onderwijsstructuur` concepts
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad-a-stroom`
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-1e-graad-b-stroom`
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-doorstroom`
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-arbeidsmarkt`
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-2e-graad-dubbel`
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-doorstroom`
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-arbeidsmarkt`
- `https://w3id.org/onderwijs-vlaanderen/id/structuur/secundair-3e-graad-dubbel`

## Additional links from onderwijsdoelen to other subdomeinen

In `onderwijsdoelen-lager.xlsx`, onderwijsdoelen for a `leergebied` that are linked in the AHOVOKS context to a concept that is not a `subdomein` in i-Learn context,
are copied here from `../onderwijsdoelen-lager.xlsx` and modified to link to each `subdomein` of the involved `leergebied`, known in i-Learn context. 
