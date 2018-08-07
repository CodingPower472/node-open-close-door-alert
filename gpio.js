
const RpioButton = require('rpi-gpio-buttons');
const gpio = require('rpi-gpio');

class GPIOHandler {
    
    readSensorInput(err) {
        if (err) throw err;
        gpio.read(this.sensorPin, (err, value) => {
            if (err) throw err;
            console.log(`Initially closed is ${value}`);
            this.closed = value;
        })
    }

    constructor(sensorPin, deactivatePin, ledPin, deactivateHoldDown, deactivateLength, doorEventCallback) {
        this.ledPin = ledPin
        this.deactivateHoldDown = deactivateHoldDown
        this.deactivateLength = deactivateLength
        this.doorEventCallback = doorEventCallback
        this.shouldListen = true;
        setup()
            .then(() => {
                gpio.on('change', (channel, value) => {
                    console.log(`Change event on channel ${channel}, now ${value}, is door ${channel === sensorPin}`)
                    if (channel === sensorPin && shouldListen) {
                        this.closed = value;
                        this.doorEventCallback(value);
                    }
                });
                this.deactivate = new RpioButton([deactivatePin], {
                    pressed: deactivateHoldDown * 1000
                });
                this.deactivate.on('pressed', pin => {
                    console.log(`Deactivating for ${deactivateLength} seconds`);
                    this.shouldListen = false;
                    setTimeout(() => this.shouldListen = true, deactivateLength * 1000)
                });
            });
    }

}

module.exports = GPIOHandler
