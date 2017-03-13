#!/bin/sh
#
# KUAL dlekin actions helper script
#
##

## Returns process pid if the process exists or empty string otherwise
dlekin_get_pid(){
	pid=`ps xa | grep "/bin/sh /mnt/base-us/dlekin/dlekin_refresh.sh" | grep -v grep | awk '{ print $1 }'`
	echo $pid
	return $pid
}

## Display status of dlekin script
dlekin_status(){
        pid=$(dlekin_get_pid)
        if [ -z $pid ]; then
			eips 1 40 "dlekin is not running                      "
        else
			eips 1 40 "dlekin is running (PID:$pid)               "
        fi
}


## Start dlekin if not running
dlekin_start(){
	pid=$(dlekin_get_pid)
	if [ -z $pid ]; then
		eips 1 40 "starting dlekin...                             "
		/bin/sh /mnt/base-us/dlekin/dlekin_refresh.sh &
	else
		eips 1 40 "dlekin is already running                      "
	fi
}

## Stop dlekin
dlekin_stop(){
	pid=$(dlekin_get_pid);
	if [ ! -z $pid ]; then
		eips 1 40 "stopping dlekin...                              "
		kill $pid
	else
		eips 1 40 "dlekin is already stopped                      "
	fi
}


## Main
case "${1}" in
	"dlekin_status" )
		${1}
	;;
	"dlekin_start" )
		${1}
	;;
	"dlekin_stop" )
		${1}
	;;	
	* )
		eips 1 40 "invalid action"
	;;
esac