#/usr/bin/env bash

# watch and compile sass on the fly;

cd "$(dirname "$0")/.." || exit
export PATH="${PWD}/node_modules/.bin:$PATH"

node-sass -w public/css/main.scss dist/main.css
