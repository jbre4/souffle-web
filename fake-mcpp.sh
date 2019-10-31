#!/bin/bash

echo "#line 1 \"/dev/stdin\""
sed -z -r 's/\.output\s+([^(\s\n]*)\s*\([^(]*\)/.output \1/g' - | sed -r 's/#.*//g' -
