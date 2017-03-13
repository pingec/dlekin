#!/bin/sh

# WRITTEN FOR KINDLE PW2 by matej.drolc@pingec.si

RTC=0
EIPS_MAX_LINES=41

currentTime () {
        date +%s
}

wait_for () {
        # calculate the time we should return
        ENDWAIT=$(( $(currentTime) + $1 ))

        # disable/reset current alarm
        echo 0 > /sys/class/rtc/rtc$RTC/wakealarm

        # set new alarm
        echo $ENDWAIT > /sys/class/rtc/rtc$RTC/wakealarm

        # check whether we could set the alarm successfully
        if [ $ENDWAIT -eq `cat /sys/class/rtc/rtc$RTC/wakealarm` ]; then
                # wait for timeout to expire
                while [ $(currentTime) -lt $ENDWAIT ]; do
                        REMAININGWAITTIME=$(( $ENDWAIT - $(currentTime) ))
                        if [ 0 -lt $REMAININGWAITTIME ]; then
                                # wait for device to resume from sleep, or for time out
                                lipc-wait-event -s $REMAININGWAITTIME com.lab126.powerd resuming || true
                        fi
                done
        else
                echo "Failure setting alarm on rtc$RTC, wanted $ENDWAIT, got `cat /sys/class/rtc/rtc$RTC/wakealarm`"
        fi

        # not sure whether this is required
        # lipc-set-prop com.lab126.powerd -i deferSuspend 1
}


EIPS_LINE=0

print_date() {
	if [ $EIPS_LINE -eq 42 ]; then
		EIPS_LINE=0
		eips -c -f	
	fi

        if [[ $(( $EIPS_LINE % 2 )) == 0 ]]; then
            eips 0 $EIPS_LINE -h "$(date)"
        else
            eips 0 $EIPS_LINE "$(date)"
        fi        

        let "EIPS_LINE++"
}

wget_file() {
        # calculate the time to break out of loop
        WGET_ENDWAIT=$(( $(currentTime) + $1 ))

        mntroot rw
        # Loop until wget has succeeded or interval has elapsed.
        while ! wget http://bantam.pingec.si/dlekin/index.php?file_name=bg_medium_ss00.png -O /usr/share/blanket/screensaver/bg_medium_ss00.png &>/dev/null && [ $(currentTime) -lt $WGET_ENDWAIT ]; do 

                echo waiting....
                sleep 1

        done
        mntroot ro
        eips -c
        eips -c
        eips -g /usr/share/blanket/screensaver/bg_medium_ss00.png
}

sleep 2 #wait for kual to finish drawing button press animation before hijacking the screen
while /bin/true; do
        wget_file 30 
	#print_date #for debugging
        echo "$(date) starting wait_for 10" >> /tmp/alarmlog
        #wait specified amount of seconds
        wait_for 3600        
        echo "$(date) exited wait_for" >> /tmp/alarmlog
done
