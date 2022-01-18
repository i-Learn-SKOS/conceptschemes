# Iconen

This folder contains the input data source **iconen.xlsx** (full),
on optional stripped version of it (**iconen-stripped.xlsx**),
their CSV exports,
the mentioned **.svg** files and an appropriate **.htaccess** file.

The selection between **iconen.xlsx** and **iconen-stripped.xlsx** is done in the corresponding mapping rules file (`../../tools/mappings/icons.yarrrml.yml`).

## Deployment
To be deployed on ilearn.ilabt.imec.be/iconen:

- `*.svg` (from this folder, not nested folders)
- `.htaccess` (from this folder)
- `icons.ttl` (from folder `../schemes`)
