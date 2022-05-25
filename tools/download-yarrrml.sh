#!/bin/bash

trap exit 1 SIGINT

downloadYARRRML(){

  local yarrrml_dir="yarrrml-parser"
  if [ ! -d $yarrrml_dir ];
  then
    git clone --branch v1.3.5 https://github.com/RMLio/yarrrml-parser.git $yarrrml_dir
    cd $yarrrml_dir
    npm i
    cd - 
  fi
}

downloadYARRRML
