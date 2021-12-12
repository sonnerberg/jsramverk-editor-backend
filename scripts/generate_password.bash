#!/usr/bin/env bash
# https://unix.stackexchange.com/questions/230673/how-to-generate-a-random-string
PASSWORD_LENGTH=32
if [[ -n "$1" ]]; then
  PASSWORD_LENGTH="$1"
else
  PASSWORD_LENGTH=32
fi

tr -dc A-Za-z0-9 </dev/urandom | head -c "$PASSWORD_LENGTH"; echo ''
