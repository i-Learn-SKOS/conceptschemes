# Onderwijsdoelen

This directory contains input files and self-created helper files about `onderwijsdoelen`, all with the purpose of creating a onderwijsdoelen SKOS concept scheme.

To read how to reconstruct, see [READMETOO.md](READMETOO.md).

Below is a birdseye overview of all files, the mappings and all known issues.

Subdirectory `ilearnextra` contains iLearn-specific extensions. Filenames follow the same structure as the one described here. 

## Input files

### Retrieved from the web
Get from https://onderwijsdoelen.be:
  
| file                                                   | url                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | download date | remark                      |
|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------|-----------------------------|
| onderwijsdoelen-lager.xlsx                             | https://onderwijsdoelen.be/resultaten?onderwijsstructuur=LO&filters=onderwijsniveau%255B0%255D%255Bid%255D%3Df7dcdedc9e9c97a653c7dba05896ef57a333480b%26onderwijsniveau%255B0%255D%255Btitel%255D%3DBasisonderwijs%26onderwijsniveau%255B0%255D%255Bwaarde%255D%3DBasisonderwijs%26bo_onderwijs_subniveau%255B0%255D%255Bid%255D%3Dc6770d35508ce6bdab180b85cb08a171f2ed94be%26bo_onderwijs_subniveau%255B0%255D%255Btitel%255D%3DBasisonderwijs%2520%253E%2520Lager%2520Onderwijs%26bo_onderwijs_subniveau%255B0%255D%255Bwaarde%255D%3DLager%2520Onderwijs                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 2021-07-15    |                             |
| onderwijsdoelen-secundair-graad1-na-modernisering.xlsx | https://onderwijsdoelen.be/resultaten?onderwijsstructuur=SO_1STE_GRAAD&version=V2_0&filters=onderwijsniveau%255B0%255D%255Bid%255D%3D0767c5a44ffdc8a05697bbe5b2021167fb49cf6e%26onderwijsniveau%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%26onderwijsniveau%255B0%255D%255Bwaarde%255D%3DSecundair%2520onderwijs%26onderwijssoort%255B0%255D%255Bid%255D%3Dd614031b440b32c6f1441ccde2cdc6620b9f2977%26onderwijssoort%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%2520%253E%2520Secundair%26onderwijssoort%255B0%255D%255Bwaarde%255D%3DSecundair%26so_graad%255B0%255D%255Bid%255D%3D4a3baa9f1d45654512ad68bfffca369060cbdd06%26so_graad%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%2520%253E%2520Secundair%2520%253E%25202de%2520graad%26so_graad%255B0%255D%255Bwaarde%255D%3D1ste%2520graad%26versie%255B0%255D%255Bwaarde%255D%3D2.0                                                                                                                                                                                                                                                                                                           | 2021-10-20    |                             |
| onderwijsdoelen-secundair-graad2-na-modernisering.xlsx | https://onderwijsdoelen.be/resultaten?onderwijsstructuur=SO_2DE_GRAAD&version=V2_0&filters=onderwijsniveau%255B0%255D%255Bid%255D%3D0767c5a44ffdc8a05697bbe5b2021167fb49cf6e%26onderwijsniveau%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%26onderwijsniveau%255B0%255D%255Bwaarde%255D%3DSecundair%2520onderwijs%26onderwijssoort%255B0%255D%255Bid%255D%3Dd614031b440b32c6f1441ccde2cdc6620b9f2977%26onderwijssoort%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%2520%253E%2520Secundair%26onderwijssoort%255B0%255D%255Bwaarde%255D%3DSecundair%26so_graad%255B0%255D%255Bid%255D%3D4a3baa9f1d45654512ad68bfffca369060cbdd06%26so_graad%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%2520%253E%2520Secundair%2520%253E%25202de%2520graad%26so_graad%255B0%255D%255Bwaarde%255D%3D2de%2520graad%26versie%255B0%255D%255Bwaarde%255D%3D2.0                                                                                                                                                                                                                                                                                                             | 2021-10-20    |                             |
| onderwijsdoelen-secundair-graad3-na-modernisering.xlsx | https://onderwijsdoelen.be/resultaten?onderwijsstructuur=SO_3DE_GRAAD&version=V2_0&filters=onderwijsniveau%255B0%255D%255Bid%255D%3D0767c5a44ffdc8a05697bbe5b2021167fb49cf6e%26onderwijsniveau%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%26onderwijsniveau%255B0%255D%255Bwaarde%255D%3DSecundair%2520onderwijs%26onderwijssoort%255B0%255D%255Bid%255D%3Dd614031b440b32c6f1441ccde2cdc6620b9f2977%26onderwijssoort%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%2520%253E%2520Secundair%26onderwijssoort%255B0%255D%255Bwaarde%255D%3DSecundair%26so_graad%255B0%255D%255Bid%255D%3D0f4e666eb77263ae2d8913a22f22486e56a82309%26so_graad%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%2520%253E%2520Secundair%2520%253E%25203de%2520graad%26so_graad%255B0%255D%255Bwaarde%255D%3D3de%2520graad%26so_graad%255B1%255D%255Bid%255D%3Dfc45525df886952ee133a6089a87ae7f3cc81f04%26so_graad%255B1%255D%255Btitel%255D%3DSecundair%2520onderwijs%2520%253E%2520Secundair%2520%253E%25203de%2520graad%2520-%25203de%2520leerjaar%26so_graad%255B1%255D%255Bwaarde%255D%3D3de%2520graad%2520-%25203de%2520leerjaar%26versie%255B0%255D%255Bwaarde%255D%3D2.0 | 2021-10-20    |                             |
| onderwijsdoelen-secundair-graad3-jaar3-bso.xlsx        | https://onderwijsdoelen.be/resultaten?onderwijsstructuur=SO_3DE_GRAAD_3DE_LEERJAAR_BSO_V1_0&filters=onderwijsniveau%255B0%255D%255Bid%255D%3D0767c5a44ffdc8a05697bbe5b2021167fb49cf6e%26onderwijsniveau%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%26onderwijsniveau%255B0%255D%255Bwaarde%255D%3DSecundair%2520onderwijs%26onderwijssoort%255B0%255D%255Bid%255D%3Dd31b3dc0801f85067a3dee3b16b5652ab368360b%26onderwijssoort%255B0%255D%255Btitel%255D%3DSecundair%2520onderwijs%2520%253E%2520Secundair%26onderwijssoort%255B0%255D%255Bwaarde%255D%3DSecundair%26so_graad%255B0%255D%255Bid%255D%3D4a3baa9f1d45654512ad68bfffca369060cbdd06%26so_graad%255B0%255D%255Bwaarde%255D%3D3de%2520graad%2520-%25203de%2520leerjaar%26so_gr3_lj3_onderwijsvorm%255B0%255D%255Bwaarde%255D%3Dbso%26versie%255B0%255D%255Bwaarde%255D%3D1.0                                                                                                                                                                                                                                                                                                                                | 2021-10-21    | not used for the time being |

## Helper files

Abbreviations in the filenames:

| abbreviation | stands for |
| ------------ | ---------- |
| L | lager |
| S | secundair |
| LG | leergebied |
| SD | subdomein |
| TH  | thema |
| SL | sleutelcompetentie |
| BS | bouwsteen |

List of helper files:
- `lookup-column-X-Y[-Z].txt` (X and Y one of the abbreviations, Z an optional extra specification)
- `lookup-more-columns-X-Y.csv` (X and Y one of the abbreviations)
- `lookup-onderwijsdoelen-X.xlsx` (X one of the abbreviations L, S)
- `onderwijsdoelen-*-prepared.xlsx` (the final helper files: converted from the `onderwijsdoelen-*.xlsx` input files)
- `onderwijsdoelen-*-prepared.csv` (the final helper files exported as CSV (utf8) and used as input for the RML mapper)
  
## Mappings

Note: the mappings are executed in the script `../tools/do-construct-all.sh`, but documented here for clarity.

What is mapped for each onderwijsdoel:
- A `URI`, constructed from the automatically generated column `Id`.
- A `skos:prefLabel`, containing the content of the column `Id`.
- A `skos:definition`, containing the content of the column `Onderwijsdoel`.
- Some `skos:related`, linking to curriculum concepts for lager and secundair.
  There is enough info available to link to:
  - for lager onderwijs:
    - `leergebieden`
    - `subdomeinen`
    - `thema's`
  - for secundair onderwijs:
    - `sleutelcompetenties`
    - `bouwstenen`

## Issues
- In general
  - The onderwijsdoelen do not have a short unique name that could be used as a skos:prefLabel. Hence we use the synthetic value from the `Id` column.

- For lager
  - For `leergebied` "Frans": no `subdomein` found in curriculum to match "Kennis" (note: covered in ilearnextra, see [READMETOO.md](READMETOO.md)).
  - For `leergebied` "Muzische vorming": no `subdomein` found in curriculum to match "MUZISCHE VORMING - ATTITUDES" (note: covered in ilearnextra, see [READMETOO.md](READMETOO.md)).
  - For `leergebied` "Wiskunde": no `subdomein` found in curriculum to match "Attitudes" (note: covered in ilearnextra, see [READMETOO.md](READMETOO.md)).
  - For `leergebied` "Lichamelijke opvoeding": only one common `subdomein` placeholder "Lichamelijke opvoeding" found in curriculum (and used as a replacement for all 3 entries "Motorische competenties", "Gezonde en veilige levensstijl" and "Zelfconcept en het sociaal functioneren").
  - For `leergebied` "Sociale vaardigheden": only one common `subdomein` placeholder "Sociale vaardigheden" found in curriculum (and used as a replacement for all 3 entries "Relatiewijzen", "Gespreksconventies" en "Samenwerking").
  - For all `leergebieden` except for "Mens en maatschappij" and "Wetenschap en techniek": no `themas` found.

- For secundair
  - Cannot create an onderwijsdoel concept for onderwijsdoelen in the input where the column `Nummer / Code` contains `zie eindterm(en)`: can't create a unique `Id` in these cases.
  - Wetenschapsdomeinen and "Onderdelen" (parts of) a wetenschapsdomein cannot be linked to curriculum concepts: in our curr1.ttl, we do not have wetenschapsdomeinen and parts of wetenschapsdomeinen.    
  - In our curriculum, some bouwstenen are shared (skos:narrower) between multiple sleutelcompetenties. Consequence: the created links are not specific for those bouwstenen. This will require queries thet specify both the sleutelcomptentie and the bouwsteen.
  - There is no onderwijsdoelen input for graad 3, leerjaar 3 at this moment.
