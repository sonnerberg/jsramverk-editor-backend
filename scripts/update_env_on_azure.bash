#!/usr/bin/env bash
PASS_USERNAME_LOCATION="services/education/bth/dbwebb.se/jsramverk/editor/azure/ftps/username"
PASS_PASSWORD_LOCATION="services/education/bth/dbwebb.se/jsramverk/editor/azure/ftps/password"
PASS_URL_LOCATION="services/education/bth/dbwebb.se/jsramverk/editor/azure/ftps/url"
lftp -u \
  "$(pass "$PASS_USERNAME_LOCATION")","$(pass "$PASS_PASSWORD_LOCATION")" \
  "$(pass "$PASS_URL_LOCATION")" << EOF

put ../.env

bye
EOF
