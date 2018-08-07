
const express = require('express');
const WebSocket = require('ws');

const SENSOR_PIN = 27;
const LED_PIN = 17;
const DEACTIVATE_PIN = 2;
const DEACTIVATE_HOLD_DOWN = 10;
const DEACTIVATE_LENGTH = 60;

// check if --no-gpio is there, meaning don't run gpio code
const arguments = process.argv;
const runGpio = !(arguments.length > 2 && arguments[2] === '--no-gpio')

const app = express();
const wss = new WebSocket.Server({
    port: 8080
});

app.use(express.static('static'));

var clients = [];
var handler;

wss.on('connection', ws => {

    console.log('Got connection');
    // get the index the client is going to be at in the array, so we can remove it by index from the array later
    var index = clients.length;
    // add the client for this connection to the array of clients
    clients.push(ws);

    // send initial state
    if (handler) {
        clients.send(handler.closed);
    }
    
    ws.on('close', () => {
        // remove this client from the list of clients
        clients.splice(index, 1);
    });

});

function notifyClients(closed) {
    console.log(`Notifiying clients, closed now ${closed}`);
    clients.forEach(client => {
        client.send(closed);
    });
}

if (runGpio) {
    const GPIOHandler = require('./gpio.js');
    handler = new GPIOHandler(SENSOR_PIN, DEACTIVATE_PIN, LED_PIN, DEACTIVATE_HOLD_DOWN, DEACTIVATE_LENGTH, notifyClients);
}

app.listen(80);
