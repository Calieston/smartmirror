#!/usr/bin/python
 
#Import
import RPi.GPIO as GPIO
import time
import datetime
 
print "BEWEGUNGSMELDER"
print ""
 
#Board Mode: Angabe der Pin-Nummer
GPIO.setmode(GPIO.BCM)
 
#GPIO Pin definieren fuer den Dateneingang vom Sensor
PIR_GPIO = 17
GPIO.setup(PIR_GPIO,GPIO.IN)

read=0
wait=0
 
try:  
 #PIR auslesen
 while GPIO.input(PIR_GPIO)==1:
   read=0
 print "WARTEN auf Bewegung..."
 
 #Abbruch ctrl+c
 while True : 
   #PIR auslesen
   read = GPIO.input(PIR_GPIO)
   
   if read==1 and wait==0: 
     print "ALARM %s: Bewegung erkannt!" % datetime.datetime.now() 
     wait=1
 
   elif read==0 and wait==1: 
     print "WARTEN auf Bewegung..." 
     wait=0
 
 time.sleep(0.01)
 
except KeyboardInterrupt:
 print "Beendet"
 GPIO.cleanup()
