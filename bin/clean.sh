#/usr/bin/env bash

# remove all build artifacts

cd "$(dirname "$0")/.." || exit

rm -rf ./dist
