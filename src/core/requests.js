let ws;
const HTTP_HOST = "http://localhost:8080/firepit";
const RAW_HOST = "localhost:8080/firepit";

const WS_PREFIX = "ws"; //!In production we'll change this to `wss`

// -------- Creation of a Room FUNCTION --------:
//* 1. Make's the POST Request to Create a Room
//* 2. Trigger's the accessing of a Room with Avatar Details

export function newRoom( room_name, room_capacity, require_occupation,
                            disp_nickname, disp_occup, disp_avatar_index
) {
  //* ---- Room Creation Payload for POST req. ---
  let payload = { room_name, room_capacity, require_occupation };

  fetch(`${HTTP_HOST}/room/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => response.text())
    .then((roomId) => {
      roomStringEncodeAndAccess(roomId, disp_nickname, disp_occup, disp_avatar_index); 
    })
    .catch((error) => console.error("Error:", error));
}

export function roomStringEncodeAndAccess(roomId, displayName, displayOccupation, avatarIndexInt) {
    
    const roomPayload = `/room/?rid=${encodeURIComponent(roomId.trim())}` +
        `&disp_name=${encodeURIComponent(displayName.trim())}` +
        `&disp_occup=${encodeURIComponent(displayOccupation.trim())}` +
        `&disp_avatar=${encodeURIComponent(avatarIndexInt)}`;

    window.location.href = roomPayload;
    return 0;
}

export function onOpenRoomStringDecode(payload) {
    //TODO:
    return 0;
}

function getOKMessage() {
  return JSON.stringify({
    messageType: 200,
  });
}

export function socketConnect(SOCKET_CONNECTION_PAYLOAD) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      console.log("already in a room");
      return;
    }
  
    if (ws) {
      ws.close();
    }
  
    const SOCKET_CONNECTION_STRING = `${WS_PREFIX}://${RAW_HOST}/websocket/${SOCKET_CONNECTION_PAYLOAD}`;
  
    console.log(SOCKET_CONNECTION_STRING);
  
    ws = new WebSocket(SOCKET_CONNECTION_STRING);
  
    ws.onopen = function (event) {
      console.log("websocket open");
      ws.send(getOKMessage());
    };
  
    // parse messages received from the server and update the UI accordingly
    ws.onmessage = function (event) {
      console.log("room data: " + event.data);
  
      const json = JSON.parse(event.data);
  
      if (!json) {
        return;
      }
  
      console.log(json);
  
      // room info message
      if (json.messageType === 60) {
        console.log("");
      }
  
      // client joins room
      if (json.messageType === 50) {
        console.log("");
      }
  
      // client leaves room
      if (json.messageType === 40) {
        console.log("");
      }
  
      // set speaker
      if (json.messageType === 30) {
        console.log("Setting speaker to " + json.speaker_id);
      }
    };
  }
  