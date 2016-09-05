from Adafruit_I2C import Adafruit_I2C
import time
import math
address = 0x39
i2c = Adafruit_I2C(address)
control_on = 0x03
control_off = 0x00
BSPD = 0xAC                 ####  Broad Spectrum Photo-Diode (Visible and IR)
IRPD = 0xAE                 ####  IR spectrum Photo-Diode



def enable():
    print"enabling"
    i2c.write8(0x80, control_on)

def disable():
    print"disabling"
    i2c.write8(0x80, control_off)

def getLight():
    ch0 = i2c.readU16(BSPD) ##Broad spectrum photo-diode
    ch1 = i2c.readU16(IRPD) ##IR spectrum photo-diode
    return ch0,ch1

def getLux():
    """This code appears to give wonky results at times (wonky being a highly
    technical term).  When the light sensing apparatus is struck by a relatively
    intense light, the results are unpredictable"""
    ch0,ch1 = getLight()
    ratio = 0
    lux = 0
    tag = 0
    if ch0 > 0:
        ratio = float(ch1)/float(ch0)
    #if ch0 == 0:
        #ratio = 1.35

    if ratio > 1.30:
        lux = 0
        tag = 0
    elif ratio > 0.80:
        lux = (0.00146 * ch0) - (0.00112 * ch1)
        tag = 4
    elif ratio > 0.61:
        lux = (0.0128 * ch0) - (0.0153 * ch1)
        tag =3
    elif ratio > 0.50:
        lux = (0.0224 * ch0) - (0.031 * ch1)
        tag = 2
    elif ratio <= 0.50:
        lux = (0.0304 * ch0) - (0.062 * ch0 * ((ch1/ch0) ** 1.4))
        tag =1
    return lux

def getLuxData():
    ch0,ch1 = getLight()
    ratio = 0
    lux = 0
    tag = 0
    if ch0 > 0:
        ratio = float(ch1)/float(ch0)
    #if ch0 == 0:
        #ratio = 1.35

    if ratio > 1.30:
        lux = 0
        tag = 0
    elif ratio > 0.80:
        lux = (0.00146 * ch0) - (0.00112 * ch1)
        tag = 4
    elif ratio > 0.61:
        lux = (0.0128 * ch0) - (0.0153 * ch1)
        tag =3
    elif ratio > 0.50:
        lux = (0.0224 * ch0) - (0.031 * ch1)
        tag = 2
    elif ratio <= 0.50:
        lux = (0.0304 * ch0) - (0.062 * ch0 * ((ch1/ch0) ** 1.4))
        tag =1
    return lux, tag, ratio, ch0, ch1

enable()

lux = getLux()
print lux

#while 1 > 0:
#    lux, tag, ratio, ch0, ch1 = getLuxData()
#    if lux > 10:
#        lux = int(lux)
#    ratio = round(ratio, 4)
#    print lux, ratio
    
#    time.sleep(0.5)
 
