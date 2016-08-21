#/usr/bin/env bash

# development startup with on-the-fly compilation

cd "$(dirname "$0")/.." || exit
export PATH="${PWD}/node_modules/.bin:$PATH"

nodemon server/server.js --exec babel-node
