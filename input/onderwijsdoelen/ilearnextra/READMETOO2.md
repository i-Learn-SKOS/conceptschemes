# i-Learn specific extra input files

This directory is an addition to its parent directory.

Extra's covered here are explained below.

## Additional onderwijsdoelen "geen eindterm"

In `onderwijsdoelen-lager.xlsx`, a dummy onderwijsdoel `geen eindterm` was created for each (`leergebied`, `subdomein`) combination that exists in i-Learn context, but not in the generic AHOVOKS context.

In `onderwijsdoelen-secundair.xlsx`, a dummy onderwijsdoel `geen eindterm` was created for each (`sleutelcompetentie`, `bouwsteen`) combination that exists in i-Learn context, but not in the generic AHOVOKS context.
For some `MyWay` application implementation reason, these dummy onderwijsdoelen are not linked to the `onderwijsstructuur`.

## Additional links from onderwijsdoelen to other subdomeinen

In `onderwijsdoelen-lager.xlsx`, onderwijsdoelen for a `leergebied` that are linked in the AHOVOKS context to a concept that is not a `subdomein` in i-Learn context,
are copied here from `../onderwijsdoelen-lager.xlsx` and modified to link to each `subdomein` of the involved `leergebied`, known in i-Learn context. 
