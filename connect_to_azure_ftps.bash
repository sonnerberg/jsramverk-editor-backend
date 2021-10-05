#!/usr/bin/env bash
lftp -u "$(pass services/education/bth/dbwebb.se/jsramverk/editor/azure/ftps/username)","$(pass services/education/bth/dbwebb.se/jsramverk/editor/azure/ftps/password)" "$(pass services/education/bth/dbwebb.se/jsramverk/editor/azure/ftps/url)"
