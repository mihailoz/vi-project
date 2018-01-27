var aiWebsocket = new WebSocket("ws://localhost:8080/game/update");
var redShipControls = {
    left: false,
    right: false,
    fire: false
};

aiWebsocket.onopen = function() {
    console.log("Websocket connection to server successfully established...")
};

aiWebsocket.onclose = function() {
    console.log("Websocket connection to server closed.");
};

aiWebsocket.onmessage = function(message) {
    var actions = JSON.parse(message.data);

    if(actions.turnLeft !== undefined && actions.turnLeft !== null)
        redShipControls.left = actions.turnLeft;
    if(actions.turnRight !== undefined && actions.turnRight !== null)
        redShipControls.right = actions.turnRight;
    if(actions.fire !== undefined && actions.fire !== null)
        redShipControls.fire = actions.fire;

    updateRedShip(redShipControls);
}

function sendGameData(data) {
    aiWebsocket.send(data);
};