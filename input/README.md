# Input files in this directory
These files are the received input files used to create concept schemes in this project.

The files do not have their original quasi-version-tagged names. Instead, each file has a generic name and consecutive versions
are available here under version control. The history is maintained below, synchronised with file updates.

# Input files in subdirectories
Subdirectories may contain more input, possibly consisting of more than one file, all about the same topic.
They all must have their own README.md.

## Secundair onderwijs

Filename: `secundair-onderwijs.xlsx`

Received as `LOM VERSIE december 2020.xlsx` on 2020-12-16 from `frederik.deridder@meemoo.be`.

Formatted to be printable on A4, portrait.

Update received as `LOM VERSIE december 2020_versie 1 SC.xlsx` on 2021-05-17 from `scarlet.coopman@kuleuven.be`.
Contents of sheet `Redux termenlijst` verified (by text compare) to be identical to previous version.
Only changes are the comments added to some cells.

Formatted to be printable on A4, portrait.

Formatted to print comments at the end of sheet "Redux termenlijst"

## Lager onderwijs

Filename: `lager-onderwijs.xlsx`

Received as `zoektermen_lager_onderwijs - 20210505.xlsx` on 2021-05-05 from `katrien.verbruggen@kuleuven.be`.

Corrected some obvious typo's (aarbol -> aardbol etc.).

Adapted sheets `Blad2` .. `Blad28` for automation:
- added top row `skos:related skos:prefLabel (etc)`
- added related concept in column A
- split up available combined prefLabels into prefLabel and altLabel
- set all prefLabel values in singular form; added plural form(s) as altLabel(s)

Duplicated thema's ICT, leren leren, sociale vaardigheden to columns leergebieden, subdomeinen
Duplicated lichamelijke opvoeding to column subdomeinen
Added leergebied, subdomein, thema: Extracurriculair
Added disambiguation `[fr-]` where needed
