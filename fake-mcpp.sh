#!/bin/bash

echo "#line 1 \"/dev/stdin\""
sed -r 's/#.*//g' - | sed -r 's/.functor.*//g' -
