#/usr/bin/env bash

# transpile server & client js, minify client js, compile css

cd "$(dirname "$0")/.." || exit
export PATH="${PWD}/node_modules/.bin:$PATH"

echo "building server js..."
./bin/build_server.js
echo ✓

echo "compiling css..."
./bin/build_css.sh
echo ✓

echo "Done."
