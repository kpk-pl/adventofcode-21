#!/bin/bash

RESULT=0
for f in day-*/{first,second}.js ; do
  ./$f
  if [[ $? -ne 0 ]] ; then
    RESULT=1
  fi
done

exit $RESULT
