#!/bin/bash
cd $(dirname "$0")/.. || exit

mkdir -p dist
node-sass public/css/main.scss dist/main.css
