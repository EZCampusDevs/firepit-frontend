
import { HTTP_HOST, LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY } from "./Constants";

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
      window.localStorage.setItem(LOCAL_STORAGE__JOIN_ROOM_QUERY_KEY, URL_ENCODED_AVATAR_REQ);
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

export async function getRngQuote(callback) {
  try {
    const response = await fetch(`${HTTP_HOST}/quote`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    callback(data.quote); // Call the callback with the quote
  } catch (error) {
    console.error("Error fetching quote:", error);
    callback("Failed to load quote."); // Call the callback with error message
  }
}
