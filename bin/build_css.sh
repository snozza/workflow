#!/usr/bin/env bash

# compile css for dist.

cd "$(dirname "$0")/.." || exit

mkdir -p dist
node-sass public/css/main.scss dist/main.css
