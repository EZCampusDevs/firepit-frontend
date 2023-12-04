let ws;
const HOST = "localhost:8080/firepit";


//* ------------------ Create of a Room ------------------

export function newRoom() {
    // Define your payload here
    let payload = {
        room_name: "YourRoomName", // Replace with the desired room name
        room_capacity: 10 // Replace with the desired room capacity
    };

    fetch(`http://${HOST}/room/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.text())
    .then(roomId => {
        socket_connect(roomId);
    })
    .catch(error => console.error('Error:', error));
}

function getOKMessage(){
    return JSON.stringify({
        messageType: 200
    });
}

function socket_connect(roomId){

    if(ws && ws.readyState === WebSocket.OPEN){
        console.log("already in a room")
        return;
    }

    if(ws) {
        ws.close();
    }
    const d = document.getElementById("clientName");
    
    console.log("Got room id from server " + roomId);

    ws = new WebSocket(`ws://${HOST}/websocket/?rid=${roomId}&name=${d.value}`);

    ws.onopen = function (event) {
        console.log("websocket open");
        ws.send(getOKMessage());
    }

    // parse messages received from the server and update the UI accordingly
    ws.onmessage = function (event) {
        console.log("room data: " + event.data);
        

        const json = JSON.parse(event.data);

        if(!json) {
            return;
        }

        console.log(json);

        
        // room info message
        if(json.messageType === 60) {
            
            console.log('');
        }

        
        // client joins room
        if(json.messageType === 50) {
            console.log('');
        }

        // client leaves room
        if(json.messageType === 40) {
            console.log('');
        }
        
        // set speaker 
        if(json.messageType === 30) {
            
            console.log("Setting speaker to " + json.speaker_id);
        }
    }
}
