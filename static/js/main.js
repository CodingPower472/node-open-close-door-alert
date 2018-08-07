
var statusElem = $('#status');
var socket = new WebSocket('ws://' + document.domain + ':8080');

socket.onopen = function(event) {
    console.log('Connected to websocket');
}

function confirmPermission() {
    // confirm permission
}

function sendNotification(closed) {
    // send notification
}

socket.onmessage = function(event) {
    var newState = event.data;
    console.log('New state: ');
    console.log(newState);
    if (newState) {
        statusElem.text('Closed');
    } else {
        statusElem.text('Open');
    }
    confirmPermission()
        .then(() => {
            sendNotification(newState);
        });
}
