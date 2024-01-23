
import { HTTP_HOST } from "./Constants";

// -------- Creation of a Room FUNCTION --------:
//* 1. Make's the POST Request to Create a Room
//* 2. Trigger's the accessing of a Room with Avatar Details

export function newRoom( room_name, room_capacity, require_occupation,
                            disp_nickname, disp_occup, disp_avatar_index
) {
  //* ---- Room Creation Payload for POST req. ---
  let payload = { room_name, room_capacity, require_occupation };

  fetch(`${HTTP_HOST}/room/new`, {
    method: "GET",
  })
    .then((response) => response.text())
    .then((roomId) => {
      
      //* Setting ls `requested_slef` variable, then Redirecting to room
      const URL_ENCODED_AVATAR_REQ = roomStringEncodeAndAccess(roomId, disp_nickname, disp_occup, disp_avatar_index); 
      window.localStorage.setItem("requested_self", URL_ENCODED_AVATAR_REQ);
      window.location.href = "/room/"+String(roomId);

    })
    .catch((error) => console.error("Error:", error));
}

export function roomStringEncodeAndAccess(roomId, displayName, displayOccupation, avatarIndexInt) {
    
    const roomPayload = `?rid=${encodeURIComponent(roomId.trim())}` +
        `&name=${encodeURIComponent(displayName.trim())}` +
        `&occup=${encodeURIComponent(displayOccupation.trim())}` +
        `&avatar=${encodeURIComponent(avatarIndexInt)}`;

    return roomPayload;

}

function getOKMessage() {
  return JSON.stringify({
    messageType: 200,
  });
}

  