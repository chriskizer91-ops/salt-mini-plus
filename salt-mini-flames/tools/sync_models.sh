#!/bin/sh
# Brings this page's copy of the Studio cars' code up to date with the models next door (../models/src: the Studio
# kit in hd/ and each car's own detail in cars/), then rebuilds the page. The page keeps its own copy so that work
# on the models never changes it by surprise: run this when you want their latest, then check the cars.
set -e
cd "$(dirname "$0")/.."
cp ../models/src/hd/*.js src/hd/
rm -rf src/cars && mkdir -p src/cars && cp -r ../models/src/cars/* src/cars/
sh build.sh
