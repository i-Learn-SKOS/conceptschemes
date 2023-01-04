# Steps to convert the dataset from v1 to v2, item: replace vak1.ttl by the *common vakken*

(The *common vakken* are defined in https://github.com/i-Learn-SKOS/common-conceptschemes/blob/v1.0.0.correct/common/schemes/vak-norelated-final.skos.ttl).

## Preparation
Start from the tag v1.0.1 of this repository.
In this version, the *vakken* are linked to *bouwstenen* in vak1.ttl, according to the input described in https://gitlab.ilabt.imec.be/KNoWS/projects/i-learn/conceptschemes/-/issues/60. 

### Dependencies
- Comunica at the command line (described [here](https://comunica.dev/docs/query/getting_started/query_cli/)). Version used: 2.4.3.
- Npm package [http-server](https://www.npmjs.com/package/http-server).  Version used: 14.1.1.
- A sed command in a bash shell.

## Steps

### Step 1: make suitable Turtle file to start from
The target for this step is to obtain all relations from *bouwstenen* to (old) *vakken* in a Turtle file.

Open a new terminal (tab), go to the `/schemes` directory of this project and start http-server:
```
http-server
```

Open a new terminal (tab), go to this directory and execute: 
```
comunica-sparql http://localhost:8080/combined-inferred.ttl -f bouwstenen-to-vakken-construct.sparql > bs-to-vak-step1.ttl
```

This command executes a SPARQL CONSTRUCT query that results in the suitable Turtle file `bs-to-vak-step1.ttl`.

### Step 2: Translate the URI's
The URI's in `bs-to-vak-step1.ttl` need to be replaced by those in https://github.com/i-Learn-SKOS/common-conceptschemes/blob/v1.0.0.correct/common/schemes/vak-norelated-final.skos.ttl.
The replacement was prepared in `was-is.xlsx` and `replace-uris.xlsx` and led to the *sed command file* `replace-uris.sed`.

Use *sed* to do the replacement:
```
sed -f replace-uris.sed bs-to-vak-step1.ttl > bs-to-vak-step2.ttl
```

The result is in `bs-to-vak-step2.ttl`

### Step3: Handle special case 'all vakken'
The special cases where *bouwstenen* link to all *vakken* in v1.0.1 need to be reviewed, as
(a) there are more *vakken* now and
(b) some of these *bouwstenen* now do no longer need to link to all *vakken*, but to some new *vakken*.

These cases are listed in sheet *bouwstenen-to-alle-vakken* of `was-is.xlsx`.

As a preparation, file `alle-vakken.txt` was created from sheet *Concepts (reverse)* of `was-is.xlsx`: column A.

Now copy file `bs-to-vak-step2.ttl` into file `bs-to-vak-step3.ttl`.

In file `bs-to-vak-step3.ttl`, replace the objects for all `ID_bouwstenen` subjects having `alle_vakken` in column `naam_vak` of sheet *bouwstenen-to-alle-vakken* of `was-is.xlsx` with the contents of file `alle-vakken.txt`.

Next, replace the objects for all `ID_bouwstenen` subjects having one or more values in column `naam_vak` of sheet *bouwstenen-to-alle-vakken* of `was-is.xlsx` with the contents of the corresponding value in column `ID_vak`.

### Step4: Add prefixes
In this step, we'll add prefixes, as a preparation for canonicalization in the next step:
```
cat prefixes.txt bs-to-vak-step3.ttl > bs-to-vak-step4.ttl
```

#### Step5 canonicalize into destination file
In this step, we'll canonicalize and put the result in the `/schemes` directory.
```
cd ../../tools
node canonicalize.js -i ../conversion/local-vak1-to-common-vak/bs-to-vak-step4.ttl -o ../schemes/bs-to-vak.ttl
```

### Step6: Integrate into combined-inferred.ttl
Remove the file `vak1.ttl` from the `/schemes` directory of this project. 

Add the raw file from https://github.com/i-Learn-SKOS/common-conceptschemes/blob/v1.0.0.correct/common/schemes/vak-norelated-final.skos.ttl to the `/schemes` directory of this project.

Modify the contents of `/schemes/elem.ttl` for the new URI of the *vakken* collection (see sheet *Collections* of `was-is.xlsx`).
```
ocol:vak skos:inScheme elem:_scheme.
```

Modify the contents of `/schemes/tref1.ttl`:
- remove the old prefix `@prefix vak1: <http://ilearn.ilabt.imec.be/vocab/vak1/> .`
- add a new prefix `@prefix ovak: <https://w3id.org/onderwijs-vlaanderen/id/vak/> .`
- replace `vak1:...` uris with their corresponding new `ovak:...` uris.

Modify the contents of `/schemes/in-use-by-myway.ttl`:
- replace `elem:vakken` occurrences with `ocol:vak`.

Modify the contents of `/tools/do-construct-all.sh` for the modified files in the directory `/schemes` and run it.

