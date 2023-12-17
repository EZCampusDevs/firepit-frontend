let ws;
const HOST = "localhost:8080/firepit";

const WS_PREFIX = 'ws' //!In production we'll change this to `wss` 

//* ------------------ Create of a Room ------------------

export function newRoom(room_name, room_capacity, require_occupation) {

    //* ---- Room Creation Payload ---
    let payload = { room_name, room_capacity, require_occupation };

    fetch(`http://${HOST}/room/new`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.text())
    .then(roomId => {
        socket_connect(roomId, "hello", "soft e.", 1);
    })
    .catch(error => console.error('Error:', error));
}

function getOKMessage(){
    return JSON.stringify({
        messageType: 200
    });
}

function socket_connect(roomId, displayName, displayOccupation, avatarIndexInt){

    if(ws && ws.readyState === WebSocket.OPEN){
        console.log("already in a room")
        return;
    }

    if(ws) {
        ws.close();
    }
    console.log("Got room id from server " + roomId);

    ws = new WebSocket(`${WS_PREFIX}://${HOST}/websocket/?rid=${roomId}&disp_name=${displayName}&disp_occup=${displayOccupation}&disp_avatar=${avatarIndexInt}`);

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
