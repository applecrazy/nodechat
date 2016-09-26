#!/bin/bash

cmd="npm start"
seconds=5

echo "Executing: ${cmd} for $seconds seconds"
$cmd&

cmdpid=$!
sleep $seconds

if [ -d /proc/$cmdpid ]
then
  echo "terminating program PID:$cmdpid"
  kill $cmdpid
fi