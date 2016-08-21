#/usr/bin/env bash

# transpiles server side code

cd "$(dirname "$0")/.." || exit
export PATH="${PWD}/node_modules/.bin:$PATH"

babel server -d dist
