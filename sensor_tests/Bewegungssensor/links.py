import RPi.GPIO as GPIO
import time
import datetime
import os
 
print "BEWEGUNGSMELDER"
 
#Board Mode: Angabe der Pin-Nummer
GPIO.setmode(GPIO.BCM)
 
#GPIO Pin definieren fuer den Dateneingang vom Sensor
PIR_GPIO = 21
GPIO.setup(PIR_GPIO, GPIO.IN)
 
def MOTION(PIR_GPIO):
     os.system("echo  \"Bewegung erkannt\"")
 
print "%s - Warten auf Bewegung" % datetime.datetime.now()  
try:
     GPIO.add_event_detect(PIR_GPIO, GPIO.RISING, callback=MOTION)
     while 1:
          time.sleep(5)
except KeyboardInterrupt:
	GPIO.cleanup()
