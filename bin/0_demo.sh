#!/bin/bash

set -e

self="${BASH_SOURCE:-$0}"
dir=$(cd $(dirname $self); pwd)

cd $dir

$(ls -1 *.sh | grep -v $(basename "$self") | peco)
